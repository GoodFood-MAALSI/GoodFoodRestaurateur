import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRestaurantDto {
        @IsString()
        @IsNotEmpty()
        name: string;

        @IsString()
        @IsNotEmpty()
        description: string;

        @IsString()
        @IsNotEmpty()
        street_number: string;

        @IsString()
        @IsNotEmpty()
        street: string;

        @IsString()
        @IsNotEmpty()
        city: string;

        @IsString()
        @IsNotEmpty()
        postal_code: string;

        @IsString()
        @IsNotEmpty()
        country: string;
    
        @IsString()
        @IsNotEmpty()
        email: string;
    
        @IsNumber()
        @IsNotEmpty()
        phone_number: number;

}
