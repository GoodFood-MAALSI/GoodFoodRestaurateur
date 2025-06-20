import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { IsEntityExists } from 'src/domain/utils/validators/is-entity-exists.validator';
import { IsPositionUniqueCreateMenuCategory } from '../decorators/is-position-unique-create-menu-category.validator';

export class CreateMenuCategoryDto {
  @ApiProperty({ example: 'Menus' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: "Position de la catégorie dans le restaurant" })
  @IsNumber()
  @IsNotEmpty()
  @IsPositionUniqueCreateMenuCategory({ message: 'Cette position est déjà utilisée pour ce restaurant.' })
  position: number;

  @ApiProperty({ example: 2, description: 'ID du restaurant' })
  @IsNumber()
  @IsNotEmpty()
  @IsEntityExists(Restaurant, {
    message: "Le restaurant n'existe pas",
  })
  restaurantId: number;
}
