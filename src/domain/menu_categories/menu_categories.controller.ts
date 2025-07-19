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
  Req,
} from '@nestjs/common';
import { MenuCategoriesService } from './menu_categories.service';
import { CreateMenuCategoryDto } from './dto/create-menu_category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu_category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { MenuCategory } from './entities/menu_category.entity';
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard';
import { Request } from 'express';

@Controller('menu-categories')
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}

  @Post()
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiBody({ type: CreateMenuCategoryDto })
  @ApiOperation({ summary: 'Créer une nouvelle catégorie de menu' })
  create(
    @Body() dto: CreateMenuCategoryDto,
    @Req() req: Request,
  ): Promise<MenuCategory> {
    const user = req.user;
    return this.menuCategoriesService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiBody({ type: UpdateMenuCategoryDto })
  @ApiOperation({ summary: 'Mettre à jour une catégorie de menu' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuCategoryDto,
    @Req() req: Request,
  ): Promise<MenuCategory> {
    const user = req.user;
    return this.menuCategoriesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une catégorie de menu' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user;
    return this.menuCategoriesService.remove(id, user.id);
  }
}
