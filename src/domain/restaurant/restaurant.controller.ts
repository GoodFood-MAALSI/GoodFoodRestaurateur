// restaurateur/src/restaurant/restaurant.controller.ts
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
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
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
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Pagination } from '../utils/pagination';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multerConfig } from 'src/multer.config';
import { Restaurant } from './entities/restaurant.entity';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { BypassResponseWrapper } from '../utils/decorators/bypass-response-wrapper.decorator';
import { Images } from '../images/entities/images.entity';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un restaurant' })
  @ApiBody({ type: CreateRestaurantDto })
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req: Request,
  ) {
    try {
      const user = req.user as JwtPayloadType;
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
  async findAll(@Query() filters: RestaurantFilterDto, @Req() req: Request) {
    try {
      const { page = 1, limit = 10 } = filters;

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
  @ApiBearerAuth()
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
      const user = req.user as JwtPayloadType;
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
  @ApiOperation({ summary: 'Récupérer un restaurant en fonction de son id' })
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

  @Get('interservice/:id')
  @ApiExcludeEndpoint()
  @BypassResponseWrapper()
  @ApiOperation({
    summary: 'Récupérer un restaurant pour appels interservices',
  })
  @ApiParam({ name: 'id', description: 'ID du restaurant', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Restaurant récupéré avec succès',
    type: Restaurant,
  })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Restaurant non trouvé' })
  async getRestaurantForInterservice(
    @Param('id') id: string,
  ): Promise<Partial<Restaurant>> {
    const restaurantId = parseInt(id);
    if (isNaN(restaurantId)) {
      throw new HttpException('ID doit être un nombre', HttpStatus.BAD_REQUEST);
    }

    const restaurant = await this.restaurantService.findOne(restaurantId);
    if (!restaurant) {
      throw new HttpException('Restaurant non trouvé', HttpStatus.NOT_FOUND);
    }

    return {
      id: restaurant.id,
      name: restaurant.name,
      street_number: restaurant.street_number,
      street: restaurant.street,
      city: restaurant.city,
      postal_code: restaurant.postal_code,
      country: restaurant.country,
      email: restaurant.email,
      phone_number: restaurant.phone_number,
      long: restaurant.long,
      lat: restaurant.lat,
      images: restaurant.images?.map((image) => ({
        ...image,
      })) as Images[],
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mettre à jour les informations d'un restaurant" })
  @ApiBody({ type: UpdateRestaurantDto })
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @Req() req: Request,
  ) {
    try {
      const user = req.user as JwtPayloadType;
      if (!user || !user.id) {
        throw new HttpException(
          'Utilisateur non authentifié',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const restaurant = await this.restaurantService.findOne(+id);
      if (!restaurant) {
        throw new HttpException(
          `Restaurant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedRestaurant = await this.restaurantService.update(
        +id,
        updateRestaurantDto,
      );
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un restaurant' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      const user = req.user as JwtPayloadType;
      if (!user || !user.id) {
        throw new HttpException(
          'Utilisateur non authentifié',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const restaurant = await this.restaurantService.findOne(+id);
      if (!restaurant) {
        throw new HttpException(
          `Restaurant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

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

  @Patch(':id/suspend')
  @ApiOperation({ summary: 'Suspendre un restaurant spécifique' })
  @ApiResponse({ status: 200, description: 'Restaurant suspendu avec succès' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Restaurant non trouvé' })
  @ApiResponse({ status: 400, description: 'Restaurant déjà suspendu' })
  async suspend(@Param('id') id: string) {
    try {
      const restaurant = await this.restaurantService.findOne(+id);
      if (!restaurant) {
        throw new HttpException(
          `Restaurant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.restaurantService.suspendRestaurant(+id);
      return { message: 'Restaurant suspendu avec succès' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Échec de la suspension du restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Réactiver un restaurant spécifique' })
  @ApiResponse({ status: 200, description: 'Restaurant réactivé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Restaurant non trouvé' })
  @ApiResponse({ status: 400, description: 'Restaurant non suspendu' })
  async restore(@Param('id') id: string) {
    try {
      const restaurant = await this.restaurantService.findOne(+id);
      if (!restaurant) {
        throw new HttpException(
          `Restaurant with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.restaurantService.restoreRestaurant(+id);
      return { message: 'Restaurant réactivé avec succès' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Échec de la réactivation du restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Uploader une image pour un restaurant spécifique' })
  @ApiParam({ name: 'id', description: 'ID du restaurant', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image à uploader (JPEG, PNG, GIF, max 5MB)',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadRestaurantImage(
    @Param('id') restaurantId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Restaurant> {
    return this.restaurantService.uploadImage(restaurantId, file);
  }

  @Patch(':restaurantId/remove-image/:imageId')
  async removeRestaurantImage(
    @Param('restaurantId') restaurantId: number,
    @Param('imageId') imageId: number,
  ): Promise<Restaurant> {
    return this.restaurantService.removeImage(restaurantId, imageId);
  }
}