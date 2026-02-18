/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import cloudinary from "./cloudinary.config";
import { removeImageType } from "./cloudinaryTypes";

@Injectable() 
export class CloudinaryService {
    public async uploadImage(file: Express.Multer.File,folder:string) {
        const result = await cloudinary.uploader.upload(
            file.path, 
            {
                folder
            }
        )
        return result

    }

    public async uploadImages(files:Express.Multer.File[],folder:string) {
        const cloudinaryFiles = files.map(async(file)=> {
            const result = await cloudinary.uploader.upload(
            file.path, 
            {
                folder
            }
        )
        return result        
        })
        const uploadedImagesLinks = await Promise.all(cloudinaryFiles);
        return uploadedImagesLinks

    }
    public async removeImage(publicId:string) {
        try {
        const result:removeImageType = await cloudinary.uploader.destroy(publicId);
        return result
        
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }
}