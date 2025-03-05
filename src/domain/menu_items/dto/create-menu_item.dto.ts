import { isNumber } from "@nestjs/class-validator";
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsString, isDecimal } from "class-validator";


export class CreateMenuItemDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    
    @IsDecimal()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    picture: string;


    @IsDecimal()
    @IsNotEmpty()
    promotion: number;

    @IsBoolean()
    @IsNotEmpty()
    isAvailable: boolean;
    
}
