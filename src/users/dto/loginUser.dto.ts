/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class LoginUserDto {



    @IsString()
    @IsEmail()
    @MaxLength(250)
    @IsNotEmpty()
    email!:string

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password!:string
    
}