/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    id!:string

    
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    newPassword!:string


    @IsString()
    @IsNotEmpty()
    resetPasswordToken!:string


}