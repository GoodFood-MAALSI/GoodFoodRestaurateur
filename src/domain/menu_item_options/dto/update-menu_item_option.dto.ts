import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemOptionDto } from './create-menu_item_option.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuItemOptionDto extends PartialType(CreateMenuItemOptionDto) {
            @ApiProperty({ example: 'choix de la boisson', required: false })
            @IsOptional()
            name?: string;

            @ApiProperty({ example: true, required: false })
            @IsOptional()
            is_required?: boolean;

            @ApiProperty({ example: true, required: false })
            @IsOptional()
            is_multiple_choice?: boolean;
}
