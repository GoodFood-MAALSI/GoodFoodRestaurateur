import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MenuItemOptionsService } from './menu_item_options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu-item-options')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuItemOptionsController {
  constructor(private readonly menuItemOptionsService: MenuItemOptionsService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemOptionDto })
  @ApiOperation({ summary: 'Créer une nouvelle option de menu' })
  create(@Body() createMenuItemOptionDto: CreateMenuItemOptionDto) {
    return this.menuItemOptionsService.create(createMenuItemOptionDto);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuItemOptionDto })
  @ApiOperation({ summary: 'Mettre à jour une option de menu' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuItemOptionDto: UpdateMenuItemOptionDto) {
    return this.menuItemOptionsService.update(+id, updateMenuItemOptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une option de menu' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemOptionsService.remove(+id);
  }
}
