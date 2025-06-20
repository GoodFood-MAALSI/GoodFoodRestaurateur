import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MenuItemOption } from 'src/domain/menu_item_options/entities/menu_item_option.entity';
import { IsEntityExists } from 'src/domain/utils/validators/is-entity-exists.validator';
import { IsPositionUniqueCreateMenuItemOptionValue } from '../decorators/is-position-unique-create-menu-item-option-value.validator';

export class CreateMenuItemOptionValueDto {
  @ApiProperty({ example: 'Coca Cola' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1.75 })
  @IsNumber()
  @IsNotEmpty()
  extra_price: number;

  @ApiProperty({
    example: 1,
    description: 'Position de l\'option item value dans le restaurant',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositionUniqueCreateMenuItemOptionValue({
    message: 'Cette position est déjà utilisée pour ce restaurant.',
  })
  position: number;

  @ApiProperty({ example: 2, description: "ID de l'option de menu" })
  @IsNumber()
  @IsNotEmpty()
  @IsEntityExists(MenuItemOption, {
    message: "L' option de menu n'existe pas",
  })
  menuItemOptionId: number;
}
