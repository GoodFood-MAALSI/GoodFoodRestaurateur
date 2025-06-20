import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemOptionValueDto } from './create-menu_item_option_value.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuItemOptionValueDto extends PartialType(
  CreateMenuItemOptionValueDto,
) {
  @ApiProperty({ example: 'Coca Cola', required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 1.75 })
  @IsNumber()
  @IsNotEmpty()
  extra_price: number;

  @ApiProperty({
    example: 1,
    description: 'Position de l\'item option value',
  })
  @IsOptional()
  @IsNumber()
  position?: number;
}
