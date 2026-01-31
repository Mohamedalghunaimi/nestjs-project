/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class UpdateReviewDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    comment?:string 
    
    @Min(1)
    @Max(5)
    @IsNumber()
    @IsOptional()
    rating?:number



}