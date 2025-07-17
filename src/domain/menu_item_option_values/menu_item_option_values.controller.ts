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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BypassResponseWrapper } from '../utils/decorators/bypass-response-wrapper.decorator';
import { MenuItemOptionValue } from './entities/menu_item_option_value.entity';

@Controller('menu-item-option-values')
export class MenuItemOptionValuesController {
  constructor(
    private readonly menuItemOptionValuesService: MenuItemOptionValuesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: CreateMenuItemOptionValueDto })
  @ApiOperation({ summary: 'Créer une nouvelle option value de menu' })
  create(@Body() createMenuItemOptionValueDto: CreateMenuItemOptionValueDto) {
    return this.menuItemOptionValuesService.create(
      createMenuItemOptionValueDto,
    );
  }

  @Get('interservice/:id')
  @ApiExcludeEndpoint()
  @BypassResponseWrapper()
  @ApiOperation({ summary: 'Récupérer une valeur d’option de menu pour appels interservices' })
  @ApiParam({ name: 'id', description: 'ID de la valeur d’option', type: Number })
  @ApiResponse({ status: 200, description: 'Valeur d’option récupérée avec succès', type: MenuItemOptionValue })
  @ApiResponse({ status: 400, description: 'ID invalide' })
  @ApiResponse({ status: 404, description: 'Valeur d’option non trouvée' })
  async getMenuItemOptionValueForInterservice(@Param('id', ParseIntPipe) id: number): Promise<Partial<MenuItemOptionValue>> {
    const optionValue = await this.menuItemOptionValuesService.findOne(id);
    if (!optionValue) {
      throw new HttpException('Valeur d’option non trouvée', HttpStatus.NOT_FOUND);
    }
    return {
      id: optionValue.id,
      name: optionValue.name,
      extra_price: optionValue.extra_price,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({ type: UpdateMenuItemOptionValueDto })
  @ApiOperation({ summary: 'Mettre à jour une option value de menu' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemOptionValueDto: UpdateMenuItemOptionValueDto,
  ) {
    return this.menuItemOptionValuesService.update(
      id,
      updateMenuItemOptionValueDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une option value de menu' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemOptionValuesService.remove(id);
  }
}