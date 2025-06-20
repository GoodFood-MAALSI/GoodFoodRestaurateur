import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu_item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
        @ApiProperty({ example: 'Menu burger', required: false })
        @IsOptional()
        name?: string;
      
        @ApiProperty({ example: 'Un délicieux burger avec frite et une boisson au choix.', required: false })
        @IsOptional()
        description?: string;

        @ApiProperty({ example: 10.50, required: false  })
        @IsOptional()
        price?: number;

        @ApiProperty({ example: 10, required: false  })
        @IsOptional()
        promotion?: number;

        @ApiProperty({ example: true, required: false  })
        @IsOptional()
        is_available?: boolean;
}
