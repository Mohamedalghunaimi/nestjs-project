/* eslint-disable prettier/prettier */

import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";


@Controller("/api/uploads")
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        if(!file) {
            throw new BadRequestException("file is not found")
        }
        return {
            file
        }
    }

    @Get(":imageId")
    public getFile(@Param("imageId") imageId:string,@Res() res:Response) {
        return res.sendFile(imageId,{root:"../images"})
    }

    @Post("multipleImages")
    @UseInterceptors(FilesInterceptor('files'))
    public uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        if(files.length===0 || !files) {
            throw new BadRequestException("files is not found")
        }
        return  files;
            
        
    }


    
    
}