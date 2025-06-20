import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { CreateMenuItemOptionDto } from '../menu_item_options/dto/create-menu_item_option.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { multerConfig } from 'multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuItem } from './entities/menu_item.entity';

@Controller('menu-items')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemDto })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Get()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuItemDto })
  update(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemsService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemsService.remove(+id);
  }

  @Get(':id/options')
  findItemsByCategories(@Param('id') id: string): Promise<MenuItemOption[]> {
    return this.menuItemsService.getMenuOptionsByMenuItemId(+id);
  }

  @Post(':id/options')
  @ApiBody({ type: CreateMenuItemOptionDto })
  addItemOptionToItem(
    @Param('id') id: string,
    @Body() createMenuItemOptionDto: CreateMenuItemOptionDto,
  ): Promise<MenuItemOption> {
    return this.menuItemsService.addMenuItemOptionToMenuItem(+id, createMenuItemOptionDto);
  }

    @Post(':id/upload-image')
    @ApiOperation({ summary: 'Uploader une image pour un menu item spécifique' }) // Description pour Swagger
    @ApiParam({ name: 'id', description: 'ID du menu item', type: Number }) // Description du paramètre d'URL
    @ApiConsumes('multipart/form-data') // Indique que le type de contenu est multipart/form-data
    @ApiBody({ // Décrit le corps de la requête pour l'upload de fichier
      schema: {
        type: 'object',
        properties: {
          image: { // 'image' doit correspondre au nom du champ dans FileInterceptor
            type: 'string',
            format: 'binary', // Indique à Swagger qu'il s'agit d'un fichier binaire
            description: 'Fichier image à uploader (JPEG, PNG, max 5MB)',
          },
          // Vous pouvez ajouter d'autres champs de formulaire si nécessaire, par exemple:
          // isMain: { type: 'boolean', description: 'Définir comme image principale' }
        },
        required: ['image'], // Indique que le champ 'image' est obligatoire
      },
    })
    @UseInterceptors(FileInterceptor('image', multerConfig)) // 'image' doit correspondre au nom du champ dans ApiBody
    async uploadRestaurantImage(
      @Param('id') menuItemId: number, 
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max 5MB
            new FileTypeValidator({ fileType: 'image/(jpeg|png|gif)' }), // Accepte JPG, PNG, GIF
          ],
        }),
      )
      file: Express.Multer.File, // Le fichier uploadé par Multer
    ): Promise<MenuItem> {
      // Le fichier a été uploadé et stocké localement par Multer grâce à UseInterceptors.
      // Maintenant, le service va enregistrer les métadonnées de l'image en BD
      // et potentiellement faire du traitement d'image.
  
      console.log('Fichier reçu dans le contrôleur:', file);
  
      return this.menuItemsService.uploadImage(menuItemId, file);
    }
  
      // Si vous avez besoin de supprimer une image spécifique
    @Patch(':menuItemId/remove-image/:imageId')
    async removeRestaurantImage(
      @Param('menuItemId') menuItemId: number,
      @Param('imageId') imageId: number,
    ): Promise<MenuItem> {
      return this.menuItemsService.removeImage(menuItemId, imageId);
    }
  
    // Route pour récupérer une image spécifique (optionnel si vous servez des fichiers statiques directement)
    // @Get('image/:filename')
    // getRestaurantImage(@Param('filename') filename: string, @Res() res) {
    //   return res.sendFile(filename, { root: './uploads/images' });
    // }
}
