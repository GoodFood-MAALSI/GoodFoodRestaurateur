import { IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    phone: number;

    @IsString()
    @IsNotEmpty()
    password: string;
}
