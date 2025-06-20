import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MenuItem } from 'src/domain/menu_items/entities/menu_item.entity';
import { IsEntityExists } from 'src/domain/utils/validators/is-entity-exists.validator';
import { IsPositionUniqueCreateMenuItemOption } from '../decorators/is-position-unique-create-menu-item-option.validator';

export class CreateMenuItemOptionDto {
  @ApiProperty({ example: 'choix de la boisson' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_required: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_multiple_choice: boolean;

  @ApiProperty({
    example: 1,
    description: 'Position du menu item option',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositionUniqueCreateMenuItemOption({
    message: 'Cette position est déjà utilisée pour cette item option.',
  })
  position: number;

  @ApiProperty({ example: 2, description: 'ID de la categorie de menu' })
  @IsNumber()
  @IsNotEmpty()
  @IsEntityExists(MenuItem, {
    message: "Le menu item de menu n'existe pas",
  })
  menuItemId: number;
}
