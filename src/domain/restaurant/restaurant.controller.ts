import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { CreateMenuCategoryDto } from '../menu_categories/dto/create-menu_category.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { CreateRestaurantTypeDto } from '../restaurant_type/dto/create-restaurant_type.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PaginationService } from './pagination.service';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Controller('restaurant')
@ApiTags('Restaurants')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly paginationService: PaginationService, // Injectez le PaginationService
  ) {}

  @Post()
  @ApiBody({ type: CreateRestaurantDto })
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    try {
      const createdRestaurant = await this.restaurantService.create(createRestaurantDto);
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
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of items per page' })
  async findAll(
    @Query() filters: RestaurantFilterDto,
    @Query('page') page = 1, // Valeur par défaut de la page
    @Query('limit') limit = 10, // Valeur par défaut de la limite
    @Req() req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ) {
    try {
      const { data, total } = await this.restaurantService.findAll(filters, page, limit);
      const { links, meta } = this.paginationService.generatePaginationMetadata(req, page, total, limit);
      return { data, links, meta };
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

  @Get(':id/categories')
  async findCategoriesByRestaurant(@Param('id') id: string): Promise<MenuCategory[]> {
    try {
      return await this.restaurantService.getMenuCategoriesByRestaurantId(+id);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to retrieve categories for restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/categories')
  @ApiBody({ type: CreateMenuCategoryDto })
  async addCategoryToRestaurant(
    @Param('id') id: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      return await this.restaurantService.addMenuCategoryToRestaurant(+id, createMenuCategoryDto);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to add category to restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/restaurant_type')
  @ApiBody({ type: CreateRestaurantTypeDto })
  async addTypeToRestaurant(
    @Param('id') id: string,
    @Body() createRestaurantTypeDto: CreateRestaurantTypeDto,
  ): Promise<RestaurantType> {
    try {
      return await this.restaurantService.addTypeToRestaurant(+id, createRestaurantTypeDto);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to add type to restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
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
}

