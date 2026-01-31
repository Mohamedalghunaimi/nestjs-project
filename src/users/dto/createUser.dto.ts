/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @Length(5)
    @IsNotEmpty()
    @ApiProperty({name:"username",description:""})
    username!:string


    @IsString()
    @IsEmail()
    @MaxLength(250)
    email!:string

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password!:string
    
}