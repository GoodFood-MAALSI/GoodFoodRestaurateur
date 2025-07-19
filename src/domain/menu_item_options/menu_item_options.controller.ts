import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { MenuItemOptionsService } from './menu_item_options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard';
import { Request } from 'express';

@Controller('menu-item-options')
export class MenuItemOptionsController {
  constructor(private readonly menuItemOptionsService: MenuItemOptionsService) {}

  @Post()
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiBody({ type: CreateMenuItemOptionDto })
  @ApiOperation({ summary: 'Créer une nouvelle option de menu' })
  create(@Body() createMenuItemOptionDto: CreateMenuItemOptionDto, @Req() req: Request) {
    const user = req.user;
    return this.menuItemOptionsService.create(createMenuItemOptionDto, user.id);
  }

  @Patch(':id')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiBody({ type: UpdateMenuItemOptionDto })
  @ApiOperation({ summary: 'Mettre à jour une option de menu' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemOptionDto: UpdateMenuItemOptionDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.menuItemOptionsService.update(id, updateMenuItemOptionDto, user.id);
  }

  @Delete(':id')
  @UseGuards(InterserviceAuthGuardFactory(['restaurateur']))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une option de menu' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user;
    return this.menuItemOptionsService.remove(id, user.id);
  }
}
