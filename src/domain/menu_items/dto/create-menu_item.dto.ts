import { IsBase64, isNumber } from "@nestjs/class-validator";
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

    @IsBase64()
    @IsNotEmpty()
    picture: string;


    @IsDecimal()
    @IsNotEmpty()
    promotion: number;

    @IsBoolean()
    @IsNotEmpty()
    isAvailable: boolean;
    
}
