import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantTypeDto } from './create-restaurant_type.dto';
import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestaurantTypeDto extends PartialType(CreateRestaurantTypeDto) {
        @ApiProperty({ example: 'Thailandais', required: false })
        @IsOptional()
        name?: string;
}
