import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  IsInt,
} from 'class-validator';
import { IsEntityExists } from '../../utils/validators/is-entity-exists.validator';
import { RestaurantType } from 'src/domain/restaurant_type/entities/restaurant_type.entity';
import { AreFieldsRequiredTogether } from 'src/domain/utils/validators/are-required-together.validator';

@AreFieldsRequiredTogether(['lat', 'long', 'perimeter'], {
  message:
    'lat, long, et perimeter doivent être fournis ensemble ou aucun ne doit l’être.',
})
export class RestaurantFilterDto {
  @ApiPropertyOptional({
    description: 'Filtrer par nom ou description (partiel ou complet)',
    example: 'Chicorée',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Filtrer par état d'ouverture",
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  is_open?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrer par ville',
    example: 'Lille',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description:
      'Filtrer par ID du type de restaurant (doit exister dans la table restaurant_type)',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsEntityExists(RestaurantType, {
    message: "Le type de restaurant n'existe pas",
  })
  restaurant_type?: number;

  @ApiPropertyOptional({
    description: 'Latitude du point de recherche',
    example: 50.6335,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  lat?: number;

  @ApiPropertyOptional({
    description: 'Longitude du point de recherche',
    example: 3.0645,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  long?: number;

  @ApiPropertyOptional({
    description: 'Périmètre en mètres autour du point',
    example: 1000,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  perimeter?: number;

  @ApiPropertyOptional({
    description: 'Numéro de la page pour la pagination',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  page?: number;

  @ApiPropertyOptional({
    description: "Nombre d'éléments par page pour la pagination",
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  limit?: number;
}
