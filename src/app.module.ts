/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { ReviewModule } from './reviews/review.module';
import {TypeOrmModule} from "@nestjs/typeorm"
import { ConfigModule } from '@nestjs/config';

import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UploadModule } from './uploads/upload.module';
import { MailModule } from './mail/mail.module';
import { dataSourceOptions } from '../db/dataSoure';

@Module({
    imports: [
        ProductModule,
        UserModule,
        ReviewModule,
        UploadModule, 
        MailModule,
        TypeOrmModule.forRoot(dataSourceOptions),
        ConfigModule.forRoot({
            isGlobal :true,
            envFilePath:  `.env.${process.env.NODE_ENV}`
        }),
    ],
    providers :[
        {
            provide:APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        },
        {
            provide:APP_PIPE,
            useFactory:() => new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true
            })
        }
    ]

})
export class AppModule {}



/*
{
            inject :[ConfigService],
            useFactory:(config:ConfigService)=> {
                return {
                    type: "postgres" ,
                    database: config.get<string>("DB_NAME"),
                    port: config.get<number>("PORT"),
                    synchronize: process.env.NODE_ENV!=='production',
                    username: config.get<string>("DB_USERNAME"),
                    password:config.get<string>("DB_PASSWORD"),
                    host: "localhost",
                    entities: [ProductEntity,User,Review],
                }
            }
        }




*/