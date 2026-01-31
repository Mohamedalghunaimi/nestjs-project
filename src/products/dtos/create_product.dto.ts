/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, Length,  Max, MaxLength, Min,  minLength,  MinLength } from "class-validator"

export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    title!: string 

    
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    description!: string


    @IsNumber()
    @IsNotEmpty()
    @Min(10 , {message: "price should be greater than 100 "})
    @Max(2000,{message:"price is more than 2000"})
    price!: number

}
