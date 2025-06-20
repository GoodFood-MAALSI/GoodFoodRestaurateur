import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, HttpException, HttpStatus, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PaginationService } from './pagination.service';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'multer.config';
import { Restaurant } from './entities/restaurant.entity';

@Controller('restaurant')
@ApiTags('Restaurants')
@ApiBearerAuth()
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly paginationService: PaginationService, // Injectez le PaginationService
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Créer un restaurant" })
  @ApiBody({ type: CreateRestaurantDto })
 async create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() req: Request) {
    try {
      // Passez l'objet Request complet au service
      const userId = req.user.id;
      const createdRestaurant = await this.restaurantService.create(createRestaurantDto);
      this.restaurantService.addUserToRestaurant(createdRestaurant.id,userId)
      return createdRestaurant;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrer par nom' })
  @ApiQuery({ name: 'description', required: false, type: String, description: 'Filtrer par description' })
  @ApiQuery({ name: 'is_open', required: false, type: 'boolean', description: 'Filtrer par état d\'ouverture' }) // Définir explicitement le type comme booléen
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filtrer par ville' })
  @ApiQuery({ name: 'country', required: false, type: String, description: 'Filtrer par pays' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'lat', required: false, type: Number, description: 'latitude point de recherche' })
  @ApiQuery({ name: 'long', required: false, type: Number, description: 'longitude point de recherche' })
  @ApiQuery({ name: 'perimeter', required: false, type: Number, description: 'En se basant sur lat et long filtrer sur une zone autour du point en mètre' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of items per page' })
  @ApiOperation({ summary: "Recupérer la liste de tous les restaurants" })
  async findAll(
    @Query() filters: RestaurantFilterDto,
    @Query('page') page = 1, // Valeur par défaut de la page
    @Query('limit') limit = 10, // Valeur par défaut de la limite
    @Req() req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ) {
    try {
      const { restaurants, total } = await this.restaurantService.findAll(filters, page, limit);
      const { links, meta } = this.paginationService.generatePaginationMetadata(req, page, total, limit);
      return { restaurants, links, meta };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to retrieve restaurants',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Recupérer un restaurant en fonction de son id" })
  async findOne(@Param('id') id: string) {
    try {
      const restaurant = await this.restaurantService.findOne(+id);
      if (!restaurant) {
        throw new HttpException(`Restaurant with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return restaurant;
    } catch (error) {
       if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to retrieve restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Mettre a jour les informations d'un restaurant" })
  @ApiBody({ type: UpdateRestaurantDto })
  async update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    try {
      const updatedRestaurant = await this.restaurantService.update(+id, updateRestaurantDto);
      if (!updatedRestaurant) {
        throw new HttpException(`Restaurant with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return updatedRestaurant;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to update restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Supprimer un restaurant" })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.restaurantService.remove(+id);
      if (!result) {
        throw new HttpException(`Restaurant with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
       if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to delete restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  @ApiOperation({ summary: "Recupérer la liste des restaurants du user en fonction de son id" })
  async getRestaurantsByUserId(@Param('userId') userId: string) {
    try {
      return await this.restaurantService.getRestaurantsByUserId(+userId);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to retrieve restaurants by user ID',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Uploader une image pour un restaurant spécifique' }) // Description pour Swagger
  @ApiParam({ name: 'id', description: 'ID du restaurant', type: Number }) // Description du paramètre d'URL
  @ApiConsumes('multipart/form-data') // Indique que le type de contenu est multipart/form-data
  @ApiBody({ // Décrit le corps de la requête pour l'upload de fichier
    schema: {
      type: 'object',
      properties: {
        image: { // 'image' doit correspondre au nom du champ dans FileInterceptor
          type: 'string',
          format: 'binary', // Indique à Swagger qu'il s'agit d'un fichier binaire
          description: 'Fichier image à uploader (JPEG, PNG, GIF, max 5MB)',
        },
        // Vous pouvez ajouter d'autres champs de formulaire si nécessaire, par exemple:
        // isMain: { type: 'boolean', description: 'Définir comme image principale' }
      },
      required: ['image'], // Indique que le champ 'image' est obligatoire
    },
  })
  @UseInterceptors(FileInterceptor('image', multerConfig)) // 'image' doit correspondre au nom du champ dans ApiBody
  async uploadRestaurantImage(
    @Param('id') restaurantId: number, // L'ID du restaurant auquel l'image est associée
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // Max 5MB
          new FileTypeValidator({ fileType: 'image/(jpeg|png|gif)' }), // Accepte JPG, PNG, GIF
        ],
      }),
    )
    file: Express.Multer.File, // Le fichier uploadé par Multer
  ): Promise<Restaurant> {
    // Le fichier a été uploadé et stocké localement par Multer grâce à UseInterceptors.
    // Maintenant, le service va enregistrer les métadonnées de l'image en BD
    // et potentiellement faire du traitement d'image.

    console.log('Fichier reçu dans le contrôleur:', file);

    return this.restaurantService.uploadImage(restaurantId, file);
  }

    // Si vous avez besoin de supprimer une image spécifique
  @Patch(':restaurantId/remove-image/:imageId')
  async removeRestaurantImage(
    @Param('restaurantId') restaurantId: number,
    @Param('imageId') imageId: number,
  ): Promise<Restaurant> {
    return this.restaurantService.removeImage(restaurantId, imageId);
  }

  // Route pour récupérer une image spécifique (optionnel si vous servez des fichiers statiques directement)
  // @Get('image/:filename')
  // getRestaurantImage(@Param('filename') filename: string, @Res() res) {
  //   return res.sendFile(filename, { root: './uploads/images' });
  // }
}

