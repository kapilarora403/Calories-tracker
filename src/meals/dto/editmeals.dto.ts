import {IsNotEmpty, IsOptional} from "class-validator";

export class EditmealsDto {
    @IsOptional()
    @IsNotEmpty()
    calories: number;

    @IsOptional()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    date: string;

    @IsOptional()
    @IsNotEmpty()
    time: string;
}
