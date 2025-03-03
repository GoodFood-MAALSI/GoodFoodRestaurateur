import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { CreateRestaurantTypeDto } from './dto/create-restaurant_type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant_type.dto';

@Controller('restaurant-type')
export class RestaurantTypeController {
  constructor(private readonly restaurantTypeService: RestaurantTypeService) {}

  @Post()
  create(@Body() createRestaurantTypeDto: CreateRestaurantTypeDto) {
    return this.restaurantTypeService.create(createRestaurantTypeDto);
  }

  @Get()
  findAll() {
    return this.restaurantTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestaurantTypeDto: UpdateRestaurantTypeDto) {
    return this.restaurantTypeService.update(+id, updateRestaurantTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantTypeService.remove(+id);
  }
}
