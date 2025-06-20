import { IsString, IsNotEmpty, IsNumber, Min, Max, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { IsEntityExists } from 'src/domain/utils/validators/is-entity-exists.validator';

export class CreateClientReviewRestaurantDto {
  @ApiProperty({
    description: 'Avis',
    example: 'Très bon restaurant, service rapide.',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  review: string;

  @ApiProperty({
    description: 'Note (entre 0 et 5)',
    example: 5,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0, { message: 'La note doit être au moins 0' })
  @Max(5, { message: 'La note ne peut pas dépasser 5' })
  rating: number;

  @ApiProperty({ example: 2, description: 'ID du restaurant' })
  @IsNumber()
  @IsNotEmpty()
  @IsEntityExists(Restaurant, {
    message: "Le restaurant n'existe pas",
  })
  restaurantId: number;

  @ApiProperty({ example: 1, description: 'ID du client' })
  @IsNumber()
  @IsNotEmpty()
  clientId: number;
}