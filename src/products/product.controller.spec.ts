/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PayloadType } from "src/users/types/types";
import { UserType } from "src/utilts/enum";
import { CreateProductDto } from "./dtos/create_product.dto";
import { NotFoundException } from "@nestjs/common";
import { UpdateProduct } from "./dtos/update_product.dto";

/* eslint-disable prettier/prettier */

type ProductType = { id:number , title:string , price:number}


const product : CreateProductDto = {
    title:"product 1",
    price:100,
    description:"this is 1th product"

}
const payLoad : PayloadType = {email:"mohammmed@gmail.com",userType:UserType.admin,id:"1"}
let products:ProductType[] = [
    { title:"product1" , price:1500 , id :1},
    { title:"product2" , price:120 ,  id :2},
    { title:"product3" , price:1400 , id :3},
]
describe("controller",() => {
    let productController:ProductController ;
    let productService :ProductService ;

    beforeEach(async()=> {
        const module:TestingModule = await Test.createTestingModule({
            controllers:[ProductController],
            providers:[
                {provide:ProductService,useValue:{
                    createNewProduct :jest.fn((dto:CreateProductDto,id:number)=> {
                        return Promise.resolve({...dto,id})

                    }),
                    getAll:jest.fn(({title,minPrice,maxPrice}:{title?:string,minPrice?:number,maxPrice?:number})=> {
                        let productsWithSameProperities = products.slice() ; 
                        if(title) {
                            productsWithSameProperities = productsWithSameProperities.filter((p)=>p.title===title)
                        } 
                        if(minPrice) {
                            productsWithSameProperities = productsWithSameProperities.filter((p)=> p.price >= minPrice  ) ;
                        }
                        if(maxPrice) {
                            productsWithSameProperities = productsWithSameProperities.filter((p)=>p.price <= maxPrice ) ;

                        }
                        return Promise.resolve(productsWithSameProperities)
                    }),
                    getOneBy:jest.fn((id:number)=> {
                        const singleProduct = products.find((pro)=> pro.id === id)
                        console.log({id,singleProduct})
                        if(!singleProduct) throw new NotFoundException("product not found")
                        Promise.resolve(singleProduct);

                    }),
                    update:jest.fn((id: number,dto : UpdateProduct)=> {
                        return Promise.resolve({...dto,id})

                    })
                }},
                {provide:ConfigService,useValue:{}},
                {provide:Reflector,useValue:{},},
                {provide:JwtService,useValue:{}}
            ]
        }).compile();
        productController = module.get<ProductController>(ProductController);
        productService = module.get<ProductService>(ProductService);

    })

    it(" 'productController' must be defined" ,() => {
        expect(productController).toBeDefined()

    })

    it(" 'createNewProduct' should be called",async() => {
        await productController.createNewProduct(product,payLoad)
        expect(productService.createNewProduct).toHaveBeenCalled()
        expect(productService.createNewProduct).toHaveBeenCalledTimes(1);
        expect(productService.createNewProduct).toHaveBeenCalledWith(product,payLoad.id)

    })
    it(" 'createNewProduct' return valid product",async()=> {
        const result = await productController.createNewProduct(product,payLoad)
        expect(result.title).toMatch(product.title) 
    })
     describe("  'getAllProducts' ",()=> {
        it(" 'getAll must be called",async() => {
            await productController.getAllProducts();
            expect(productService.getAll).toHaveBeenCalled();
            expect(productService.getAll).toHaveBeenCalledTimes(1);
            expect(productService.getAll).toHaveBeenCalledWith({})
        })
        it(" test the getAll without params",async() => {
            const result = await productController.getAllProducts();
            expect(result).toHaveLength(products.length)

        })
        it( " test getAllProduct with params",async() => {
            const result = await productController.getAllProducts("product1",1000,100);
            expect(result.length).toBe(0);

        })

     })

     describe( " 'getById" ,() => {

        it("getOneBy must be called",async()=> {
            await productController.getSingleProduct(1)
            expect(productService.getOneBy).toHaveBeenCalled();
            expect(productService.getOneBy).toHaveBeenCalledWith(1);
            expect(productService.getOneBy).toHaveBeenCalledTimes(1)


        })
        it(" test GetSingleProduct with  id",async() => {
            try {
                const result = await productController.getSingleProduct(20);
                expect(result.id).toBe(1);

            } catch (error:any) {
                if(error.response) {
                    expect(error.message).toMatch('product not found')

                }
            }

        })
        
    })


    describe(" updateProduct",() => {
        it("  Update is been called",async()=> {
            
            await productController.updateProduct("1",{title:"product:1"})
            expect(productService.update).toHaveBeenCalledTimes(1);
        })
        it(" update with param",async()=> {
            const result = await productController.updateProduct("1",{title:"product:1"});
            expect(result.id).toBe(1);
            expect(result.title).toBe("product:1")

        })
        
    })


    
})