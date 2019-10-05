import {IsAlphanumeric, IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class AuthCredentialsDto {
    @IsEmail()
    email: string;

    @IsAlphanumeric()
    @MinLength(5)
    password: string;

}

export enum UserRole {
    ADMIN = 'admin',
    USER_MANAGER = 'user-manager',
    REGULAR = 'regular',
}
