import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class RestaurantFilterDto {
  @ApiPropertyOptional({ description: 'Filtrer par nom (partiel ou complet)', example: 'Burger' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrer par description (partiel ou complet)', example: 'gourmet' })
  @IsOptional()
  @IsString()
  description?: string;

@ApiPropertyOptional({ description: "Filtrer par état d'ouverture", example: true, type: Boolean })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  is_open?: boolean;

  @ApiPropertyOptional({ description: 'Filtrer par ville', example: 'Paris' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filtrer par pays', example: 'France' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Filtrer par type de restaurant', example: 'Sushi' })
  @IsOptional()
  @IsString()
  resturant_type?: string;

  @ApiPropertyOptional({ description: 'Filtrer par longitude', example: 16.00000 })
  @IsOptional()
  @IsString()
  long?: number;

  @ApiPropertyOptional({ description: 'Filtrer par type de latitude', example: 16.00000 })
  @IsOptional()
  @IsString()
  lat?: number;

  @ApiPropertyOptional({ description: 'Filtrer dans un périmètre en mètre à partir du point long lat ci dessus', example: 16.00000 })
  @IsOptional()
  @IsString()
  perimeter?: number;
}