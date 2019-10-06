import {IsAlphanumeric, IsEmpty, IsOptional, MinLength} from "class-validator";

export class EditUserDto {
    @IsOptional()
    @IsEmpty()
    email: string;

    @IsOptional()
    @MinLength(5)
    @IsAlphanumeric()
    password: string;
}
