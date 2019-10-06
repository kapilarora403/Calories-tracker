import {IsNotEmpty} from "class-validator";

export class CreatemealsDto {
    @IsNotEmpty()
    calories: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    time: string;
}
