import { IsBase64, isNumber } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsString, isDecimal } from "class-validator";


export class CreateMenuItemDto {
    @ApiProperty({ example: 'Menu burger' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 10.50 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ example: 'Un délicieux burger avec frite et une boisson au choix' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsNotEmpty()
    promotion: number;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    is_available: boolean;
    
}
