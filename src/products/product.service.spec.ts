 
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
 
 
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
 
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing"
import { ProductService } from "./product.service"
import { UserServices } from "src/users/user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductEntity } from "./product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dtos/create_product.dto";


type ProductType = { id:number , title:string , price:number}
type OpitionType = {
    where:{
        title?:string,
        maxPrice? : number ,
        minPrice : number
    }

}

type findOne = {
    where:{
        id:number
    }
}

/* eslint-disable prettier/prettier */
describe("product service",()=> {
    let productService :ProductService ;
    let productRepository: Repository<ProductEntity>
    const  REPOSITORY_TOKEN = getRepositoryToken(ProductEntity) ;
    const createProductDto :CreateProductDto = {
        title:"book",
        price:100,
        description :"this is the best book"

    };

    let products:ProductType[] = [
        { title:"product1" , price:1500 , id :1},
        { title:"product2" , price:120 ,  id :2},
        { title:"product3" , price:1400 , id :3},
    ]
    beforeEach(async () => {
        const module : TestingModule = await Test.createTestingModule({
            providers :[
                ProductService,
                {provide:UserServices,useValue:{
                    getCurrentUser:jest.fn((id:number)=> Promise.resolve({id}))
                }},
                {provide:REPOSITORY_TOKEN,useValue:{
                    create: jest.fn((dto:CreateProductDto)=>  dto ),
                    save: jest.fn((dto:CreateProductDto)=> {
                        return Promise.resolve({...dto,id:2})
                    }),
                    find :jest.fn((opitions?:OpitionType)=> {
                        if(opitions) {
                            if(opitions.where.title) {
                                return Promise.resolve(products.slice(0,2))
                            }
                        }

                        return Promise.resolve(products)
                    }),
                    findOne : jest.fn((data:findOne)=> {
                        const product = products.find((singleProduct)=>singleProduct.id ===data.where.id)
                        if(product) {
                            return Promise.resolve(product);
                        }
                    }),
                    remove: jest.fn((product:ProductEntity)=> {
                        const index = products.findIndex((singleProduct)=>singleProduct.id === product.id) ;
                        if(index!=-1) {
                            const product = products.splice(index,1)[0];
                            return Promise.resolve(product);
                        }
                    })
                }}
            ]
        }).compile()

        productService = module.get<ProductService>(ProductService);
        productRepository = module.get<Repository<ProductEntity>>(REPOSITORY_TOKEN)



    })

    it("product service should be defined",() => {
        expect(productService).toBeDefined();
    })

    it("productRepository should be defined",() => {
        expect(productRepository).toBeDefined();
    })

    describe("createProduct",() => {
        it(" 'create' should be called",async () => {
            await productService.createNewProduct(createProductDto,
            "1"
        )
            expect(productRepository.create).toHaveBeenCalled();
            expect(productRepository.create).toHaveBeenCalledTimes(1);

        })
        it(" 'update' should be called",async () => {
            await productService.createNewProduct(createProductDto,
            "1"
        )
            expect(productRepository.save).toHaveBeenCalled();
            expect(productRepository.save).toHaveBeenCalledTimes(1);

        })
        it("sould create new product",async () => {
            const result = await productService.createNewProduct(createProductDto,
            "1");
            expect(result.id).toBe(2) ; 
            expect(result.title).toMatch(createProductDto.title)
            expect(productRepository.save).toHaveBeenCalled()  
            expect(productRepository.create).toHaveBeenCalled()  


        })
    });
    describe(" 'getAllProducts" , () => {

        it("return all products" ,async() => {
            const products = await productService.getAll({});
            expect(products).toHaveLength(3)
            
        })
        it("return filter products",async() => {
            const products = await productService.getAll({title:"product 1"});
            expect(products).toHaveLength(2)

        })
    })

    describe(" 'getOneById' " ,() => {
        it('should called findOne' ,async()=> {
            await productService.getOneBy(1);
            expect(productRepository.findOne).toHaveBeenCalled();
            expect(productRepository.findOne).toHaveBeenCalledTimes(1)


        })

        it("should return valid product or error",async() => {
            expect.assertions(1);
            try {
                const result = await productService.getOneBy(100);
                console.log(result)
                expect(result).toBeDefined();
                expect(result.id).toBe(1)
            } catch (error:any) {
                if(error.response) {
                expect(error.message).toMatch("product not found")

                }

                
            }

        })
    })

    describe(" 'Update' " ,() => {
        const title =  "product title"
        it(" save should be called and findOne ",async() => {
            const result = await productService.update(1,{title});
            expect(productRepository.save).toHaveBeenCalled();
            expect(productRepository.save).toHaveBeenCalledTimes(1);
            expect(productRepository.findOne).toHaveBeenCalled();
            expect(result.title).toMatch(title)
            

        });
        it("should throw error or return product",async() => {
            try {
                const id = 30000;
                const result = await productService.update(id,{title})
                expect(result.id).toBe(id);
                expect(result.title).toMatch(title)
            } catch (error:any) {
                if(error.response) {
                    expect(error.message).toBe("product not found");
                    expect(error.status).toBe(404)
                }

            }

        })

    })

    describe("delete" ,() => {
        it("findOne and remove should be called",async () => {
            await productService.delete(1);
            expect(productRepository.findOne).toHaveBeenCalled();
            expect(productRepository.remove).toHaveBeenCalled()


        })
        it("should throw error or  product",async() => {
            try {
                const result = await productService.delete(1);
                console.log(result)
                expect(result.id).toBe(1);

            } catch (error:any) {
                if(error.response) {
                    expect(error.status).toBe(404)

                }
                
            }
        })
    })


    
})





