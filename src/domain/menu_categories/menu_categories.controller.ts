import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MenuCategoriesService } from './menu_categories.service';
import { CreateMenuCategoryDto } from './dto/create-menu_category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu_category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MenuCategory } from './entities/menu_category.entity';

@Controller('menu-categories')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}
  //
  @Post()
  @ApiBody({ type: CreateMenuCategoryDto })
  @ApiOperation({ summary: 'Créer une nouvelle catégorie de menu' })
  create(@Body() dto: CreateMenuCategoryDto): Promise<MenuCategory> {
    return this.menuCategoriesService.create(dto);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuCategoryDto })
  @ApiOperation({ summary: 'Mettre à jour une catégorie de menu' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.menuCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une catégorie de menu' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuCategoriesService.remove(+id);
  }
}
