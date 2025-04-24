import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRestaurantTypeDto {
            @ApiProperty({ example: 'Italien' })
            @IsString()
            @IsNotEmpty()
            name: string;
}
