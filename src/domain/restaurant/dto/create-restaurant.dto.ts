import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Matches, MaxLength } from 'class-validator';
import { RestaurantType } from 'src/domain/restaurant_type/entities/restaurant_type.entity';
import { IsEntityExists } from 'src/domain/utils/validators/is-entity-exists.validator';
import { IsSiretUnique } from '../validators/is-siret-unique.validator';
import { User } from 'src/domain/users/entities/user.entity';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Le Nouveau Restaurant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Un tout nouveau restaurant avec une cuisine innovante.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '45' })
  @IsString()
  @IsNotEmpty()
  street_number: string;

  @ApiProperty({ example: 'Avenue des Délices' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Paris' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: '75001' })
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty({ example: 'France' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'nouveau.restaurant@email.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '33123456789' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ example: '12345678901234' })
  @IsNotEmpty()
  @MaxLength(14)
  @IsSiretUnique({ message: 'Ce numéro SIRET existe déjà' })
  siret: string;

  @ApiProperty({ example: 16.0 })
  @IsNumber()
  long: number;

  @ApiProperty({ example: 16.0 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_open: boolean;

  @ApiProperty({ example: 2, description: 'ID du type de restaurant' })
  @IsNumber()
  @IsNotEmpty()
  @IsEntityExists(RestaurantType, { message: 'Le type de restaurant n\'existe pas' })
  restaurantTypeId: number;
}
