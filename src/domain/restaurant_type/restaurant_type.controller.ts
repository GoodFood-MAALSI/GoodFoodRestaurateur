import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { CreateRestaurantTypeDto } from './dto/create-restaurant_type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant_type.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantType } from './entities/restaurant_type.entity';

@Controller('restaurant-type')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
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

  @Post(':id/restaurant_type')
  @ApiBody({ type: CreateRestaurantTypeDto })
  async addTypeToRestaurant(
    @Param('id') id: string,
    @Body() createRestaurantTypeDto: CreateRestaurantTypeDto,
  ): Promise<RestaurantType> {
    try {
      return await this.restaurant_type_service.addTypeToRestaurant(+id, createRestaurantTypeDto);
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
}
