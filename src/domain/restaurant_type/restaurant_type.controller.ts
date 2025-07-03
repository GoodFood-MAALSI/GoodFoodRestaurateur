import { Controller, Get } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('restaurant-type')
export class RestaurantTypeController {
  constructor(private readonly restaurantTypeService: RestaurantTypeService) {}

  @Get()
  @ApiOperation({ summary: 'Recupérer la liste des types de restaurant' })
  findAll() {
    return this.restaurantTypeService.findAll();
  }
}
