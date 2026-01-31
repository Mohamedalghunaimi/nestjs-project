/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length,  MinLength } from "class-validator"

export class UpdateUserDto {



    @IsString()
    @IsEmail()
    @Length(5,150)
    @IsOptional()
    username?:string

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    @IsOptional()
    password?:string
    
}
