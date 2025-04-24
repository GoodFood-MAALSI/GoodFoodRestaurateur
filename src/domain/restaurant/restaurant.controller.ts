import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { CreateMenuCategoryDto } from '../menu_categories/dto/create-menu_category.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

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
  findAll() {
    return this.restaurantService.findAll();
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
}
