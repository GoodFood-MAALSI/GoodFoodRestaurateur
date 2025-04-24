import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuCategoryDto } from './create-menu_category.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMenuCategoryDto extends PartialType(CreateMenuCategoryDto) {
        @ApiProperty({ example: 'Menus', required: false })
        @IsOptional()
        name?: string;
}
