import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMenuCategoryDto {
    @ApiProperty({ example: 'Menus' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
