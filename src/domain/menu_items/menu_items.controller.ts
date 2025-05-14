import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { CreateMenuItemOptionDto } from '../menu_item_options/dto/create-menu_item_option.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('menu-items')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemDto })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Get()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuItemDto })
  update(@Param('id') id: string, @Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemsService.update(+id, updateMenuItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemsService.remove(+id);
  }

  @Get(':id/options')
  findItemsByCategories(@Param('id') id: string): Promise<MenuItemOption[]> {
    return this.menuItemsService.getMenuOptionsByMenuItemId(+id);
  }

  @Post(':id/options')
  @ApiBody({ type: CreateMenuItemOptionDto })
  addItemOptionToItem(
    @Param('id') id: string,
    @Body() createMenuItemOptionDto: CreateMenuItemOptionDto,
  ): Promise<MenuItemOption> {
    return this.menuItemsService.addMenuItemOptionToMenuItem(+id, createMenuItemOptionDto);
  }
}
