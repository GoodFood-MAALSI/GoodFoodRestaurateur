import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu-items')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemDto })
  @ApiOperation({ summary: 'Créer un item de menu' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuItemDto })
  @ApiOperation({ summary: 'Mettre à jour un item de menu' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemsService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un item de menu' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.remove(+id);
  }
}
