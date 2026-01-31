/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    comment!:string 
    
    @Min(1)
    @Max(5)
    @IsNumber()
    rating!:number



}