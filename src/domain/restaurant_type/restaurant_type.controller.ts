import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { CreateRestaurantTypeDto } from './dto/create-restaurant_type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant_type.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('restaurant-type')
export class RestaurantTypeController {
  constructor(private readonly restaurant_type_service: RestaurantTypeService) {}

  @Post()
  @ApiBody({ type: CreateRestaurantTypeDto })
  create(@Body() create_restaurant_type_dto: CreateRestaurantTypeDto) {
    return this.restaurant_type_service.create(create_restaurant_type_dto);
  }

  @Get()
  findAll() {
    return this.restaurant_type_service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurant_type_service.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateRestaurantTypeDto })
  update(@Param('id') id: string, @Body() updateRestaurantTypeDto: UpdateRestaurantTypeDto) {
    return this.restaurant_type_service.update(+id, updateRestaurantTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurant_type_service.remove(+id);
  }
}
