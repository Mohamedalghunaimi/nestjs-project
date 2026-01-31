/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreateProductDto } from './dtos/create_product.dto';
import { UpdateProduct } from './dtos/update_product.dto';
import { Injectable } from '@nestjs/common';
import {Between, Like, Repository} from "typeorm"
import { ProductEntity } from './product.entity';
import {InjectRepository} from "@nestjs/typeorm"
import { UserServices } from 'src/users/user.service';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly userService: UserServices
        
     ) {

    }
    public async createNewProduct(  {title , price, description } : CreateProductDto, id:string ) : Promise<ProductEntity> {
        const user = await this.userService.getCurrentUser(id);
        const product = this.productRepository.create(
            {
                title:title.toLowerCase(),
                price,
                description,
                user
            }
        )
        const productSaved = await this.productRepository.save(product);
        return productSaved
    }


    public async getAll(title?:string,maxPrice?:string,minPrice?:string)  {
        try {
            const filterLogic = {
                ...(title? {title:Like(`%${title.toLowerCase()}`)}:{}),
                ...(maxPrice && minPrice?{price:Between(parseInt(minPrice),parseInt(maxPrice))}:{})
            }
            const products :    ProductEntity[] = await this.productRepository.find({
                where :filterLogic
            });
        return products ;
        } catch (error) {
            console.log(error)
        }
  

    }

    public async getOneBy( id: number ) {
        const singleProduct = await this.productRepository.findOne({
            where : {
                id
            }
        });
        if(!singleProduct) {
            throw new NotFoundException("product not found");
        }
        return singleProduct;
    }

    public async update (id: number,{ title ,price ,description} : UpdateProduct) {
        const product = await  this.getOneBy(id);
        product.title = title ?? product.title;
        product.price = price ?? product.price;
        product.description = description ?? product.description ;
        const savedproduct = await this.productRepository.save(product)

        return savedproduct




    }


    public async delete(id:number) {
        const product = await this.getOneBy(id);
        const removedProduct = await this.productRepository.remove(product);

        return removedProduct;

        


    }

    
}