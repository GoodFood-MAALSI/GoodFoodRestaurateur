import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';

@Controller('menu-item-option-values')
export class MenuItemOptionValuesController {
  constructor(private readonly menuItemOptionValuesService: MenuItemOptionValuesService) {}

  @Post()
  create(@Body() createMenuItemOptionValueDto: CreateMenuItemOptionValueDto) {
    return this.menuItemOptionValuesService.create(createMenuItemOptionValueDto);
  }

  @Get()
  findAll() {
    return this.menuItemOptionValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemOptionValuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuItemOptionValueDto: UpdateMenuItemOptionValueDto) {
    return this.menuItemOptionValuesService.update(+id, updateMenuItemOptionValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemOptionValuesService.remove(+id);
  }
}
