import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemOptionValueDto } from './create-menu_item_option_value.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuItemOptionValueDto extends PartialType(CreateMenuItemOptionValueDto) {
                @ApiProperty({ example: 'Coca Cola', required: false })
                @IsOptional()
                name?: string;
    
                @ApiProperty({ example: 1, required: false })
                @IsOptional()
                number?: number;
}
