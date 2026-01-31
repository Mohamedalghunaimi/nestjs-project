/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator"

export class UpdateProduct {
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string 

    @IsString()
    @IsNotEmpty()
    @Length(0,400)
    @IsOptional()

    description?: string

    
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    price?: number

}
