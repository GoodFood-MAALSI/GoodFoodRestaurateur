import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { MenuCategoriesService } from './menu_categories.service';
import { CreateMenuCategoryDto } from './dto/create-menu_category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu_category.dto';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { CreateMenuItemDto } from '../menu_items/dto/create-menu_item.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MenuCategory } from './entities/menu_category.entity';
import { RestaurantService } from '../restaurant/restaurant.service';

@Controller('menu-categories')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService,
    private readonly restaurantService: RestaurantService,
  ) {}

  @Post()
  @ApiBody({ type: CreateMenuCategoryDto })
  create(@Body() createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menuCategoriesService.create(createMenuCategoryDto);
  }

  @Get()
  findAll() {
    return this.menuCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuCategoryDto })
  update(@Param('id') id: string, @Body() updateMenuCategoryDto: UpdateMenuCategoryDto) {
    return this.menuCategoriesService.update(+id, updateMenuCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuCategoriesService.remove(+id);
  }

  @Get(':id/items')
  findItemsByCategories(@Param('id') id: string): Promise<MenuItem[]> {
    return this.menuCategoriesService.getMenuItemsByMenuCategoryId(+id);
  }

  @Post(':id/items')
  @ApiBody({ type: CreateMenuItemDto })
  addItemToCategory(
    @Param('id') id: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuCategoriesService.addMenuItemToMenuCategory(+id, createMenuItemDto);
  }

  @Get(':id/categories')
  async findCategoriesByRestaurant(@Param('id') id: string): Promise<MenuCategory[]> {
    try {
      return await this.restaurantService.getMenuCategoriesByRestaurantId(+id);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to retrieve categories for restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/categories')
  @ApiBody({ type: CreateMenuCategoryDto })
  async addCategoryToRestaurant(
    @Param('id') id: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      return await this.menuCategoriesService.addMenuCategoryToRestaurant(+id, createMenuCategoryDto);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to add category to restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
