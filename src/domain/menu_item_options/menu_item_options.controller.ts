import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuItemOptionsService } from './menu_item_options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { CreateMenuItemOptionValueDto } from '../menu_item_option_values/dto/create-menu_item_option_value.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('menu-item-options')
export class MenuItemOptionsController {
  constructor(private readonly menuItemOptionsService: MenuItemOptionsService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemOptionDto })
  create(@Body() createMenuItemOptionDto: CreateMenuItemOptionDto) {
    return this.menuItemOptionsService.create(createMenuItemOptionDto);
  }

  @Get()
  findAll() {
    return this.menuItemOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemOptionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuItemOptionDto })
  update(@Param('id') id: string, @Body() updateMenuItemOptionDto: UpdateMenuItemOptionDto) {
    return this.menuItemOptionsService.update(+id, updateMenuItemOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemOptionsService.remove(+id);
  }

  @Get(':id/option-values')
  findOptionValuesByOptions(@Param('id') id: string): Promise<MenuItemOptionValue[]> {
    return this.menuItemOptionsService.getMenuOptionValuessByMenuOptionId(+id);
  }

  @Post(':id/option-values')
  @ApiBody({ type: CreateMenuItemOptionValueDto })
  addValueToOption(
    @Param('id') id: string,
    @Body() createMenuItemOptionValueDto: CreateMenuItemOptionValueDto,
  ): Promise<MenuItemOptionValue> {
    return this.menuItemOptionsService.addMenuItemOptionValueToMenuItemOption(+id, createMenuItemOptionValueDto);
  }
}
