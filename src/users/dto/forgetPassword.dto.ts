/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";


export class ForgetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(250)
    email!:string

}