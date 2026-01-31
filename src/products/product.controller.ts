/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards, ValidationPipe} from "@nestjs/common";
import { Request , Response } from "express";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dtos/create_product.dto";
import { UpdateProduct } from "./dtos/update_product.dto";
import { ConfigService } from "@nestjs/config";
import { Roles } from "../users/decorators/roles.decorator";
import { RolesGurad } from "../users/guards/RolesGuard";
import { UserType } from "../utilts/enum";
import { currentUserDecorator } from "src/users/decorators/currentUser.decorator";
import { PayloadType } from "../users/types/types";
import { ApiQuery } from "@nestjs/swagger";



@Controller("/api/products")
export class ProductController {

    private readonly productService : ProductService;
    private readonly config : ConfigService;

    constructor(productService:ProductService,config : ConfigService) {
        this.productService = productService;
        this.config = config;
    }

    


    @Post() 
    @Roles(UserType.admin)
    @UseGuards(RolesGurad)
    public async createNewProduct(@Body() body : CreateProductDto,@currentUserDecorator() payload:PayloadType ) {

        const product = await this.productService.createNewProduct(body,payload.id);
        return product;
            
        

    }


    @Get("")
    @ApiQuery({
        name:"title",
        type:"string",
        required:false,
        description:"title of the product"
    })
    @ApiQuery({
        name:"maxPrice",
        type:"number",
        required:false,
        description:"maxmium price of the product"
    })
    @ApiQuery({
        name:"minPrice",
        type:"number",
        required:false,
        description:"minmium price of the product"
    })
    public async getAllProducts(
        @Query("title") title?:string ,
        @Query("maxPrice") maxPrice?:string,
        @Query("minPrice") minPrice?:string,
    ) {
        const products = await this.productService.getAll(
            
            title,
            maxPrice,
            minPrice
            
        );
        return products
    }
    @Get(":id")
    public async getSingleProduct(@Param("id",ParseIntPipe) id: number ) {
        const product = await this.productService.getOneBy(id) ;
        return product
        

    }

    @Put(":id")
    @UseGuards(RolesGurad)
    @Roles(UserType.admin)
    @HttpCode(HttpStatus.OK)
    
    public updateProduct (
    @Param("id") id : string ,
    @Body(new ValidationPipe()) body: UpdateProduct) {
        return this.productService.update( parseInt(id), body );

    }

    @Delete(":id")
    @UseGuards(RolesGurad)
    @Roles(UserType.admin)
    @HttpCode(HttpStatus.OK)
    public async deleteProduct(@Param("id") id : string ,) {
        const result =  await this.productService.delete( parseInt(id) );
        return result;
    }

    


}


// service يجب يكون قي busniesss logic  التعامل مع البيانات و 



    /*

    @Post("express-way")
    public createProduct(
        @Req() req:Request , 
        @Res() res:Response ,
        @Headers()  headers:any  )  {

        console.log(headers)


        res.cookie("token","this is a token",{
            httpOnly:true,
            maxAge:1000*5,
            secure:true,
            sameSite:true,
        }) // you  can use this way in order to use cookies


        res.status(201).json({
            success:true,
            message: "product is created successfully !"
        })
    } // maybe need req and res in your work*/