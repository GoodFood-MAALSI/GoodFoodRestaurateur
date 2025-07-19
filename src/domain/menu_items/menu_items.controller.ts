import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { multerConfig } from 'src/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuItem } from './entities/menu_item.entity';
import { BypassResponseWrapper } from '../utils/decorators/bypass-response-wrapper.decorator';
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard';
import { Request } from 'express';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiBody({ type: CreateMenuItemDto })
  @ApiOperation({ summary: 'Créer un item de menu' })
  create(@Body() createMenuItemDto: CreateMenuItemDto, @Req() req: Request) {
    const user = req.user;
    return this.menuItemsService.create(createMenuItemDto, user.id);
  }

  @Patch(':id')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiBody({ type: UpdateMenuItemDto })
  @ApiOperation({ summary: 'Mettre à jour un item de menu' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.menuItemsService.update(id, updateMenuItemDto, user.id);
  }

  @Delete(':id')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un item de menu' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user;
    return this.menuItemsService.remove(id, user.id);
  }

  @Post(':id/upload-image')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Uploader une image pour un menu item spécifique' })
  @ApiParam({ name: 'id', description: 'ID du menu item', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image à uploader (JPEG, PNG, max 5MB)',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadRestaurantImage(
    @Param('id', ParseIntPipe) menuItemId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max 5MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|gif)' }), // Accepte JPG, PNG, GIF
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<MenuItem> {
    const user = req.user;
    return this.menuItemsService.uploadImage(menuItemId, file, user.id);
  }

  @Patch(':menuItemId/remove-image/:imageId')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une image d’un menu item' })
  async removeRestaurantImage(
    @Param('menuItemId', ParseIntPipe) menuItemId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Req() req: Request,
  ): Promise<MenuItem> {
    const user = req.user;
    return this.menuItemsService.removeImage(menuItemId, imageId, user.id);
  }

  // Route pour récupérer une image spécifique (optionnel si vous servez des fichiers statiques directement)
  // @Get('image/:filename')
  // getRestaurantImage(@Param('filename') filename: string, @Res() res) {
  //   return res.sendFile(filename, { root: './uploads/images' });
  // }

  @Get('interservice/:id')
  @ApiExcludeEndpoint()
  @BypassResponseWrapper()
  @ApiOperation({
    summary: 'Récupérer un menu item pour appels interservices',
  })
  @ApiParam({ name: 'id', description: 'ID du restaurant', type: Number })
  async getMenuItemForInterservice(
    @Param('id') id: string,
  ): Promise<Partial<MenuItem>> {
    const menuItemId = parseInt(id);
    if (isNaN(menuItemId)) {
      throw new HttpException('ID doit être un nombre', HttpStatus.BAD_REQUEST);
    }

    const restaurant = await this.menuItemsService.findOne(menuItemId);
    if (!restaurant) {
      throw new HttpException('Restaurant non trouvé', HttpStatus.NOT_FOUND);
    }

    return {
      id: restaurant.id,
      name: restaurant.name,
      price: restaurant.price,
      promotion: restaurant.promotion,
    };
  }
}
