/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { BadRequestException, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServices } from './user.service';


import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    controllers: [UserController],
    imports : [
    MailModule,
    TypeOrmModule.forFeature([User]),
    CloudinaryModule,
    MulterModule.register(
        {
        storage:diskStorage({
            filename:(req, file, cb) => {
                const uniqueName =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueName + extname(file.originalname));

            }
        }),
        fileFilter:(req, file, cb)=> {
            if(!file.mimetype.startsWith("image")) {
                cb(new BadRequestException('invalid file'), false);
            }
            cb(null,true)
            

        },
        limits:{
            fileSize:1024*1024*2
        }
    }
    ),
        JwtModule.registerAsync({
        global: true,
        inject:[ConfigService],
        useFactory: (config :ConfigService ) => {
            return {
                secret: config.get<string>("JWT_SECRET")! ,
                signOptions: { expiresIn:  1000*60*60*24*7},   
            }
        }
    })

],
    providers:[UserServices],
    exports: [ UserServices]


})
export class UserModule {}
