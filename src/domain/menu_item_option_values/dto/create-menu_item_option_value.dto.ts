import { IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateMenuItemOptionValueDto {
        @IsString()
        @IsNotEmpty()
        name: string;

        @IsDecimal()
        @IsNotEmpty()
        extra_price: number;
}
