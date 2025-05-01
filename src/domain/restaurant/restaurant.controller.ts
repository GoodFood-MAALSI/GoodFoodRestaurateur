import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { CreateMenuCategoryDto } from '../menu_categories/dto/create-menu_category.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { CreateRestaurantTypeDto } from '../restaurant_type/dto/create-restaurant_type.dto';

@Controller('restaurant')
@ApiTags('Restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiBody({ type: CreateRestaurantDto })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrer par nom' })
  @ApiQuery({ name: 'description', required: false, type: String, description: 'Filtrer par description' })
  @ApiQuery({ name: 'is_open', required: false, type: Boolean, description: 'Filtrer par état d\'ouverture' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filtrer par ville' })
  @ApiQuery({ name: 'country', required: false, type: String, description: 'Filtrer par pays' })
  findAll(@Query() filters: RestaurantFilterDto) {
    return this.restaurantService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateRestaurantDto })
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(+id);
  }

  @Get(':id/categories')
  findCategoriesByRestaurant(@Param('id') id: string): Promise<MenuCategory[]> {
    return this.restaurantService.getMenuCategoriesByRestaurantId(+id);
  }

  @Post(':id/categories')
  @ApiBody({ type: CreateMenuCategoryDto })
  addCategoryToRestaurant(
    @Param('id') id: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.restaurantService.addMenuCategoryToRestaurant(+id, createMenuCategoryDto);
  }

  @Post(':id/restaurant_type')
  @ApiBody({ type: CreateRestaurantTypeDto })
  addTypeToRestaurant(
    @Param('id') id: string,
    @Body() createRestaurantTypeDto: CreateRestaurantTypeDto,
  ): Promise<RestaurantType> {
    return this.restaurantService.addTypeToRestaurant(+id, createRestaurantTypeDto);
  }
}
