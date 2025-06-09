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
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Pagination } from '../utils/pagination';

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
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filtrer par nom',
  })
  @ApiQuery({
    name: 'is_open',
    required: false,
    type: Boolean,
    description: "Filtrer par état d'ouverture",
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
    description: 'Filtrer par ville',
  })
  @ApiQuery({
    name: 'restaurant_type',
    required: false,
    type: Number,
    description: 'Filtrer par type de restaurant',
  })
  @ApiQuery({
    name: 'lat',
    required: false,
    type: Number,
    description: 'Latitude du point de recherche',
    example: 50.6335,
  })
  @ApiQuery({
    name: 'long',
    required: false,
    type: Number,
    description: 'Longitude du point de recherche',
    example: 3.0645,
  })
  @ApiQuery({
    name: 'perimeter',
    required: false,
    type: Number,
    description: 'Périmètre en mètres autour du point',
    example: 1000,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Nombre maximum d’items par page',
    example: 10,
  })
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
}
