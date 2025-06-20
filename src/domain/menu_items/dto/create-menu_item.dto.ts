import { IsBase64, isNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isDecimal,
} from 'class-validator';
import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
import { IsEntityExists } from 'src/domain/utils/validators/is-entity-exists.validator';
import { IsPositionUniqueCreateMenuItem } from '../decorators/is-position-unique-create-menu-items.validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Menu burger' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 'Un délicieux burger avec frite et une boisson au choix',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  promotion: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  is_available: boolean;

  @ApiProperty({
    example: 1,
    description: 'Position de l\'item de menu',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositionUniqueCreateMenuItem({
    message: 'Cette position est déjà utilisée pour cette categorie.',
  })
  position: number;

  @ApiProperty({ example: 2, description: 'ID de la categorie de menu' })
  @IsNumber()
  @IsNotEmpty()
  @IsEntityExists(MenuCategory, {
    message: "La categorie de menu n'existe pas",
  })
  menuCategoryId: number;
}
