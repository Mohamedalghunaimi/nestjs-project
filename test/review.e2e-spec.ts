/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */

import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { ProductEntity } from "src/products/product.entity";
import { Review } from "src/reviews/reviews.entity";
import { User } from "src/users/user.entity";
import { App } from "supertest/types";
import { DataSource } from "typeorm";
import request from 'supertest';

describe("productController-e2e", () => {
    let app: INestApplication<App>;
    let dataSource :DataSource ;
    let accessToken :string ;
    beforeEach(async()=> {
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
    afterEach(async() => {
        await dataSource.createQueryBuilder().delete().from(ProductEntity).execute()
        await dataSource.createQueryBuilder().delete().from(User).execute()
        await dataSource.createQueryBuilder().delete().from(Review).execute()

        await app.close();
    })

    describe("Post",() => {


        it("should create review with status 201",async()=> {

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200});


            const productId:string  = createProductresposne.body.id;
            const createReviewResponse = await request(app.getHttpServer())
            .post(`/api/reviews/${productId}`)
            .set("authorization",`Bearer ${accessToken}`)
            .send({
                comment:"very very good",
                rating:3
            })
            expect(createReviewResponse.status).toBe(201)
        })
        it("should create review with status 404",async()=> {

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200});


            const productId:string  = createProductresposne.body.id;
            const createReviewResponse = await request(app.getHttpServer())
            .post(`/api/reviews/${3333}`)
            .set("authorization",`Bearer ${accessToken}`)
            .send({
                comment:"very very good",
                rating:3
            })
            expect(createReviewResponse.status).toBe(404)
        })
        it("should create review with status 403",async()=> {

            const createProductresposne = await request(app.getHttpServer())
            .post("/api/products")
            .set("authorization",`Bearer ${accessToken}`)
            .send({title:"laptop" ,description:"this is the best laptop ", price:200});


            const productId:string  = createProductresposne.body.id;
            const createReviewResponse = await request(app.getHttpServer())
            .post(`/api/reviews/${productId}`)
            .send({
                comment:"very very good",
                rating:3
            })
            expect(createReviewResponse.status).toBe(401)
        })
    })


})