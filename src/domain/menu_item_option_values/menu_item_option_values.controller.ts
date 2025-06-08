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
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('menu-item-option-values')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MenuItemOptionValuesController {
  constructor(
    private readonly menuItemOptionValuesService: MenuItemOptionValuesService,
  ) {}

  @Post()
  @ApiBody({ type: CreateMenuItemOptionValueDto })
  @ApiOperation({ summary: 'Créer une nouvelle option value de menu' })
  create(@Body() createMenuItemOptionValueDto: CreateMenuItemOptionValueDto) {
    return this.menuItemOptionValuesService.create(
      createMenuItemOptionValueDto,
    );
  }

  @Patch(':id')
  @ApiBody({ type: UpdateMenuItemOptionValueDto })
  @ApiOperation({ summary: 'Mettre à jour une option value de menu' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemOptionValueDto: UpdateMenuItemOptionValueDto,
  ) {
    return this.menuItemOptionValuesService.update(
      +id,
      updateMenuItemOptionValueDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une option value de menu' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemOptionValuesService.remove(+id);
  }
}
