import { Controller, Get, UseGuards } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard';

@Controller('restaurant-type')
export class RestaurantTypeController {
  constructor(private readonly restaurantTypeService: RestaurantTypeService) {}

  @Get()
  @UseGuards(InterserviceAuthGuardFactory(['client', 'deliverer', 'super-admin', 'admin', 'restaurateur']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recupérer la liste des types de restaurant' })
  findAll() {
    return this.restaurantTypeService.findAll();
  }
}
