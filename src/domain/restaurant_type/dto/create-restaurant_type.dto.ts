import { IsNotEmpty, IsString } from "class-validator";

export class CreateRestaurantTypeDto {
            @IsString()
            @IsNotEmpty()
            name: string;
}
