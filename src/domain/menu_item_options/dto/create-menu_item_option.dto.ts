import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateMenuItemOptionDto {
        @IsString()
        @IsNotEmpty()
        name: string;

        @IsBoolean()
        is_required: boolean;

        @IsBoolean()
        is_multiple_choice: boolean;
}
