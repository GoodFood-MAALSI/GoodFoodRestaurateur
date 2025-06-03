import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRestaurantDto {
        @ApiProperty({ example: 'Le Nouveau Restaurant' })
        @IsString()
        @IsNotEmpty()
        name: string;

        @ApiProperty({ example: 'Un tout nouveau restaurant avec une cuisine innovante.' })
        @IsString()
        @IsNotEmpty()
        description: string;

        @ApiProperty({ example: '45' })
        @IsString()
        @IsNotEmpty()
        street_number: string;

        @ApiProperty({ example: 'Avenue des Délices' })
        @IsString()
        @IsNotEmpty()
        street: string;

        @ApiProperty({ example: 'Paris' })
        @IsString()
        @IsNotEmpty()
        city: string;

        @ApiProperty({ example: '75001' })
        @IsString()
        @IsNotEmpty()
        postal_code: string;

        @ApiProperty({ example: 'France' })
        @IsString()
        @IsNotEmpty()
        country: string;
    
        @ApiProperty({ example: 'nouveau.restaurant@email.com' })
        @IsString()
        @IsNotEmpty()
        email: string;
    
        @ApiProperty({ example: '33123456789' })
        @IsString()
        @IsNotEmpty()
        phone_number: string;

        @ApiProperty({ example: '63201210000012' })
        @IsString()
        @IsNotEmpty()
        siret: string;

        @ApiProperty({ example: 16.0000 })
        @IsNumber()
        long: number;

        @ApiProperty({ example: 16.0000 })
        @IsNumber()
        lat: number;

        @ApiProperty({ example: true })
        @IsBoolean()
        is_open: boolean;
}
