import {IsNotEmpty, IsOptional} from "class-validator";

export class GetmealsfilterDto {

    @IsOptional()
    @IsNotEmpty()
    fromDate: string;

    @IsOptional()
    @IsNotEmpty()
    toDate: string;

    @IsOptional()
    @IsNotEmpty()
    fromTime: string;

    @IsOptional()
    @IsNotEmpty()
    toTime: string;

}
