import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMenuCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
