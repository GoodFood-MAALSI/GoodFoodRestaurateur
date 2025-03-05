import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { CreateMenuCategoryDto } from '../menu_categories/dto/create-menu_category.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Patch(':id')
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
  addCategoryToRestaurant(
    @Param('id') id: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.restaurantService.addMenuCategoryToRestaurant(+id, createMenuCategoryDto);
  }
}
