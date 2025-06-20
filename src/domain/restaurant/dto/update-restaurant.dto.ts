import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEntityExists } from 'src/domain/utils/validators/is-entity-exists.validator';
import { RestaurantType } from 'src/domain/restaurant_type/entities/restaurant_type.entity';

export class UpdateRestaurantDto {
  @ApiProperty({ example: 'Le Restaurant Renommé', required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Un restaurant bien établi avec une clientèle fidèle.',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '101', required: false })
  @IsOptional()
  street_number?: string;

  @ApiProperty({ example: 'Boulevard des Saveurs', required: false })
  @IsOptional()
  street?: string;

  @ApiProperty({ example: 'Lyon', required: false })
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '69000', required: false })
  @IsOptional()
  postal_code?: string;

  @ApiProperty({ example: 'France', required: false })
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'renommé@email.com', required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '33456789123', required: false })
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ example: '63201210000012', required: false })
  @IsOptional()
  siret: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  is_open?: boolean;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  @IsEntityExists(RestaurantType, { message: 'Le type de restaurant n\'existe pas' })
  restaurantTypeId?: number;
}
