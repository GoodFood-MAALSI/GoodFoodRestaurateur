import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateMenuItemOptionDto {
        @ApiProperty({ example: 'choix de la boisson' })
        @IsString()
        @IsNotEmpty()
        name: string;

        @ApiProperty({ example: true })
        @IsBoolean()
        is_required: boolean;

        @ApiProperty({ example: true })
        @IsBoolean()
        is_multiple_choice: boolean;
}
