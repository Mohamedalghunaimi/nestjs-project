/* eslint-disable prettier/prettier */

import { BadRequestException, Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { diskStorage } from "multer";
import { MulterModule } from "@nestjs/platform-express";
import { extname } from "path";

@Module({
    controllers:[UploadController],
    imports:[
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
    ]

})
export class UploadModule {

    
}