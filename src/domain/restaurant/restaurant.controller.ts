import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
   ApiConsumes,
   ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Pagination } from '../utils/pagination';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'src/multer.config';
import { Restaurant } from './entities/restaurant.entity';

@Controller('restaurant')
@ApiTags('Restaurants')
@ApiBearerAuth()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Créer un restaurant' })
  @ApiBody({ type: CreateRestaurantDto })
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req: Request,
  ) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        throw new HttpException(
          'Utilisateur non authentifié',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const createdRestaurant = await this.restaurantService.create({
        ...createRestaurantDto,
        userId: user.id,
      });

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
  @ApiOperation({ summary: 'Récupérer la liste de tous les restaurants' })
  @ApiQuery({ type: RestaurantFilterDto })
  async findAll(
    @Query() filters: RestaurantFilterDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: Request,
  ) {
    try {
      const { restaurants, total } = await this.restaurantService.findAll(
        filters,
        page,
        limit,
      );
      const { links, meta } = Pagination.generatePaginationMetadata(
        req,
        page,
        total,
        limit,
      );

      return { restaurants, links, meta };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Échec de la récupération des restaurants',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Récupérer les restaurants créés par l’utilisateur connecté',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getRestaurantFromUser(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      const user = req.user;
      if (!user || !user.id) {
        throw new HttpException(
          'Utilisateur non authentifié',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const { restaurants, total } =
        await this.restaurantService.getRestaurantFromUser(
          user.id,
          page,
          limit,
        );

      const { links, meta } = Pagination.generatePaginationMetadata(
        req,
        page,
        total,
        limit,
      );

      return { restaurants, links, meta };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Échec de la récupération des restaurants utilisateur',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Recupérer un restaurant en fonction de son id' })
  async findOne(@Param('id') id: string) {
    try {
      const restaurant = await this.restaurantService.findOne(+id);
      if (!restaurant) {
        throw new HttpException(
          `Restaurant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
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
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    try {
      const updatedRestaurant = await this.restaurantService.update(
        +id,
        updateRestaurantDto,
      );
      if (!updatedRestaurant) {
        throw new HttpException(
          `Restaurant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
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
  @ApiOperation({ summary: 'Supprimer un restaurant' })
  async remove(@Param('id') id: string) {
    try {
      await this.restaurantService.remove(+id);
      return { message: 'Restaurant supprimé avec succès' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Échec de la suppression du restaurant',
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

