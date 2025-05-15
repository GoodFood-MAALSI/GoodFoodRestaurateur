import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req} from '@nestjs/common';
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
import { PaginationService } from './pagination.service';
import { Request } from 'express';

@Controller('restaurant')
@ApiTags('Restaurants')
@ApiBearerAuth()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService,private readonly paginationService: PaginationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBody({ type: CreateRestaurantDto })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  // @UseGuards(AuthGuard('jwt')) // Retiré pour désactiver la protection sur cette route
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filtrer par nom' })
  @ApiQuery({ name: 'description', required: false, type: String, description: 'Filtrer par description' })
  @ApiQuery({ name: 'is_open', required: false, type: Boolean, description: 'Filtrer par état d\'ouverture' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filtrer par ville' })
  @ApiQuery({ name: 'country', required: false, type: String, description: 'Filtrer par pays' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }) // Ajout du paramètre page
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of items per page' }) // Ajout du paramètre limit
  async findAll(
    @Query() filters: RestaurantFilterDto,
    @Query('page') page = 1, // Valeur par défaut de la page
    @Query('limit') limit = 10, // Valeur par défaut de la limite
    @Req() req: Request,
  )  {
    const { data, total } = await this.restaurantService.findAll(filters, page, limit);
    const { links, meta } = this.paginationService.generatePaginationMetadata(req, page, total, limit);
    return { data, links, meta };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiBody({ type: UpdateRestaurantDto })
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(+id, updateRestaurantDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/categories')
  findCategoriesByRestaurant(@Param('id') id: string): Promise<MenuCategory[]> {
    return this.restaurantService.getMenuCategoriesByRestaurantId(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/categories')
  @ApiBody({ type: CreateMenuCategoryDto })
  addCategoryToRestaurant(
    @Param('id') id: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.restaurantService.addMenuCategoryToRestaurant(+id, createMenuCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/restaurant_type')
  @ApiBody({ type: CreateRestaurantTypeDto })
  addTypeToRestaurant(
    @Param('id') id: string,
    @Body() createRestaurantTypeDto: CreateRestaurantTypeDto,
  ): Promise<RestaurantType> {
    return this.restaurantService.addTypeToRestaurant(+id, createRestaurantTypeDto);
  }

  @UseGuards(AuthGuard('jwt'))
    @Get('user/:userId')
  async getRestaurantsByUserId(@Param('userId') userId: string) {
      return this.restaurantService.getRestaurantsByUserId(+userId);
  }
}
