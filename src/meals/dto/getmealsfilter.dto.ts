import {IsNotEmpty, IsOptional} from "class-validator";

export class GetmealsfilterDto {

    @IsOptional()
    @IsNotEmpty()
    search: string;

}
