import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { CreateRestaurantTypeDto } from './dto/create-restaurant_type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant_type.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantType } from './entities/restaurant_type.entity';

@Controller('restaurant-type')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth()
export class RestaurantTypeController {
  constructor(private readonly restaurant_type_service: RestaurantTypeService) {}

  @Post()
  @ApiBody({ type: CreateRestaurantTypeDto })
  @ApiOperation({ summary: 'Créer un type de restaurant' })
  create(@Body() create_restaurant_type_dto: CreateRestaurantTypeDto) {
    return this.restaurant_type_service.create(create_restaurant_type_dto);
  }

  @Get()
  @ApiOperation({ summary: 'Recupérer la liste des types de restaurant' })
  findAll() {
    return this.restaurant_type_service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un type de restaurant en fonction de son ID' })
  findOne(@Param('id') id: string) {
    return this.restaurant_type_service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre a jour les informations d\'un type de restaurant' })
  @ApiBody({ type: UpdateRestaurantTypeDto })
  update(@Param('id') id: string, @Body() updateRestaurantTypeDto: UpdateRestaurantTypeDto) {
    return this.restaurant_type_service.update(+id, updateRestaurantTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un type de restaurant' })
  remove(@Param('id') id: string) {
    return this.restaurant_type_service.remove(+id);
  }
}
