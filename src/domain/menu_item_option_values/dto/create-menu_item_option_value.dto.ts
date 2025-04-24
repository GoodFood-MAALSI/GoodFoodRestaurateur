import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateMenuItemOptionValueDto {
        @ApiProperty({ example: 'Coca Cola' })
        @IsString()
        @IsNotEmpty()
        name: string;

        @ApiProperty({ example: 1 })
        @IsDecimal()
        @IsNotEmpty()
        extra_price: number;
}
