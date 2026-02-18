/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { CreateProductDto } from "src/products/dtos/create_product.dto";
import { ProductEntity } from "src/products/product.entity";
import { App } from "supertest/types";
import { DataSource } from "typeorm";
import request from 'supertest';
import { User } from "src/users/user.entity";

/* eslint-disable prettier/prettier */
describe("productController-e2e",() => {
    let app: INestApplication<App>;
    let dataSource :DataSource ;
    let productsToSave : CreateProductDto[] ;
    let accessToken:string ;
    beforeEach(async() => {
        productsToSave = [
            {title:"laptop" ,description:"this is the best laptop ", price:200},
            {title:"mobile" ,description:"this is the best mobile ", price:2000},
            {title:"computer" ,description:"this is the best computer ", price:100},

        ]
        const module : TestingModule =  await Test.createTestingModule({
            imports: [AppModule]
        }).compile()
        
        app = module.createNestApplication() ;
        dataSource = app.get(DataSource);
        await app.init();


        const registerResponse = await request(app.getHttpServer())
        .post("/api/auth/register")
        .send(
            {
                email:"mohammed@gmail.com",
                password:"23456789",
                username:"mohammednabil123"
            }
        )
        const loginResponse = await request(app.getHttpServer())
        .post("/api/auth/login")
        .send(
            {
                email:"mohammed@gmail.com",
                password:"23456789",
            }
        )
        accessToken = loginResponse.body.accessToken ;
    })
    afterEach(async()=> {
        await dataSource.createQueryBuilder().delete().from(ProductEntity).execute()
        await dataSource.createQueryBuilder().delete().from(User).execute()

        await app.close();
    })
    describe("GET",()=> {
        beforeEach(async()=> {
            await dataSource
            .createQueryBuilder()
            .insert().into(ProductEntity)
            .values(productsToSave)
            .execute();
        })
        it("should return all products ",async() => {
            const resposne = await request(app.getHttpServer()).
            get("/api/products")
            expect( resposne.status).toBe(200);
            expect(resposne.body).toHaveLength(productsToSave.length)
        })
        it("should return single product with id ",async()=> {
            let id : string ;

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})
            console.log(createProductresposne.body)

            id = createProductresposne.body.id;
            const getSingleProductresposne = await request(app.getHttpServer()).
            get(`/api/products/${id}`)
            
            expect(getSingleProductresposne.status).toBe(200)
            expect(getSingleProductresposne.body).toMatchObject({title:"laptop" ,description:"this is the best laptop ", price:200})



        })

        it("should return not found ",async()=> {
            const getSingleProductresposne = await request(app.getHttpServer()).
            get(`/api/products/1786621`)
            expect(getSingleProductresposne.status).toBe(404)
        })


    })

    describe("POST",()=> {
        it("should create new product and return with it",async() => {


            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})

            expect(createProductresposne.body.title).toBe("laptop");
            expect(createProductresposne.status).toBe(201);
            expect(createProductresposne.body).toMatchObject({title:"laptop" ,description:"this is the best laptop ", price:200});


        });
        it("should return status 400 if title has less characters",async() => {


            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"l" ,description:"this is the best laptop ", price:200})

            expect(createProductresposne.status).toBe(400);


        });
        it("should return status 400 if price  less than 10",async() => {


            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:5})

            expect(createProductresposne.status).toBe(400);


        });
        it("should return status 403 if token is not provided",async() => {


            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .send({title:"laptop" ,description:"this is the best laptop ", price:5})

            expect(createProductresposne.status).toBe(401);


        });
    })


    describe("PUT",() => {
        it("it should update with status 200",async()=> {
            let id : string ;

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})
            console.log(createProductresposne.body)
            expect(createProductresposne.status).toBe(201)

            id = createProductresposne.body.id;
            const updateProductresposne = await request(app.getHttpServer()).
            put(`/api/products/${id}`)
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop2"})
            
            expect(updateProductresposne.status).toBe(200)
        })
        it("it should update with status 401",async()=> {
            let id : string ;

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})
            console.log(createProductresposne.body)
            expect(createProductresposne.status).toBe(201)

            id = createProductresposne.body.id;
            const updateProductresposne = await request(app.getHttpServer()).
            put(`/api/products/${id}`)
            .send({title:"laptop2"})
            
            expect(updateProductresposne.status).toBe(401)
        })
        it("it should update with status 404",async()=> {
            let id : string ;

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})
            console.log(createProductresposne.body)
            expect(createProductresposne.status).toBe(201)

            id = createProductresposne.body.id;
            const updateProductresposne = await request(app.getHttpServer())
            .put(`/api/products/2222222`)
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop2"})
            
            expect(updateProductresposne.status).toBe(404)
        })
    })

    describe("Delete",()=> {
        it("should delete successfully with 200",async()=> {
            let id : string ;

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})
            console.log(createProductresposne.body)
            expect(createProductresposne.status).toBe(201);

            id = createProductresposne.body.id;
            const deleteProductresposne = await request(app.getHttpServer())
            .delete(`/api/products/${id}`)
            .set("authorization",`Bearer ${accessToken}`)
            .send()
            expect(createProductresposne.status).toBe(201);
        })
       it("should delete drop with 401",async()=> {
            let id : string ;

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})
            console.log(createProductresposne.body)
            expect(createProductresposne.status).toBe(201);

            id = createProductresposne.body.id;
            const deleteProductresposne = await request(app.getHttpServer())
            .delete(`/api/products/${id}`)
            expect( deleteProductresposne.status).toBe(401);
        })

    })
    it("should delete successfully with 200",async()=> {
            let id : string ;

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200})
            console.log(createProductresposne.body)
            expect(createProductresposne.status).toBe(201);

            id = createProductresposne.body.id;
            const deleteProductresposne = await request(app.getHttpServer())
            .delete(`/api/products/${203}`)
            .set("authorization",`Bearer ${accessToken}`)
            expect(deleteProductresposne.status).toBe(404);
    })

})