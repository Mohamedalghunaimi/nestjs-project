/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserServices } from "./user.service";
import { LoginUserDto } from "./dto/loginUser.dto";
import { accessTokenType, PayloadType } from "./types/types";
import { AuthGuard } from "./guards/authGuard";
import { currentUserDecorator } from "./decorators/currentUser.decorator";
import { User } from "./user.entity";
import { Roles } from "./decorators/roles.decorator";
import { UserType } from "../utilts/enum";
import { RolesGurad } from "./guards/RolesGuard";
import { UpdateUserDto } from "./dto/UpdateUser.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import {  ForgetPasswordDto } from "./dto/forgetPassword.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";


@Controller("api/auth")
@ApiTags('Users group')

export class UserController {

    constructor(private readonly userServices: UserServices ) {

    }
    @Post("/register")
    @HttpCode(HttpStatus.OK)
    public async register(@Body() createUserDto : CreateUserDto) :Promise<{message:string}> {
        const {message} = await this.userServices.createUser(createUserDto); 
        return {
            message
        }

        
    }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    public async login(@Body() LoginUserDto : LoginUserDto) {
        try {
        const result =  await this.userServices.userLogin(LoginUserDto); 
        return result;
        } catch (error) {
            console.error(error)
        }



        
    }

    @Get("/currentUser")
    @UseGuards(AuthGuard)
    @ApiSecurity("bearer")

    public async getCurrentUser ( @currentUserDecorator() payload:PayloadType) {

        const {id} : { id: string } = payload;

        const user = await this.userServices.getCurrentUser(id);

        return {
            user
        }

    }

    @Get("/users") 
    @Roles(UserType.admin)
    @UseGuards(RolesGurad)
    @ApiSecurity("bearer")

    public async getAllUsers() : Promise<User[]> {

        const users = await this.userServices.getAll();
        return users;
    }

    @Put("/update/:id")
    @Roles(UserType.admin,UserType.normal)
    @UseGuards(RolesGurad)
    @ApiSecurity("bearer")
    public async UpdateUser(@Param("id") id:string  ,@Body() body:UpdateUserDto) :Promise<User> {
        const user = await this.userServices.updateUser(id,body);
        return user;

    }

    @Delete("/user/:id")
    @Roles(UserType.admin,UserType.normal)
    @UseGuards(RolesGurad)
    public async deleteUser(@Param("id") id:string, @currentUserDecorator() payload:PayloadType  ) {
        await this.userServices.deleteUser({
            id,payload
        })
        return {
            message :"user deleted successfully !"
        }

    }

    @Post("upload-image")
    @UseGuards(AuthGuard)
    @ApiSecurity("bearer")
    @UseInterceptors(FileInterceptor('file'))
    public async uploadImage(@UploadedFile() file: Express.Multer.File,@currentUserDecorator() user:PayloadType ) {
        if(!file) {
            throw new BadRequestException("invalid file!")
        }
        const savedUser = await this.userServices.setProfileImage(file,parseInt(user.id));
        
        return {
            message:"profile image is changed",
            user:savedUser

        }

    }


    @Delete("/images/remove-image")
    @ApiSecurity("bearer")
    @UseGuards(AuthGuard)
    public async removeProfileImage(@currentUserDecorator() payload:PayloadType) {
        const user = await this.userServices.removeProfileImage(payload.id);
        return user
        
    }

    @Get("/images/:image")
    @UseGuards(AuthGuard)
    public showGetImage(@Param("image") image:string,@Res() res:Response) {
        return res.sendFile(image,{root:"../../images/user"})
        
    }


    @Get("/verify-email/:userId/:verificationToken")
    public async verifyEmail(
        @Param("userId") userId:string ,
        @Param("verificationToken") verificationToken:string
    ) {
        await this.userServices.verifyEmail(userId,verificationToken)
        return {
            message:"email is done"
        }

    }


    @Post("forget-password")
    @HttpCode(HttpStatus.OK)
    public async forgetPassword(@Body() body: ForgetPasswordDto) {
        const {email} = body ;
        return await this.userServices.sendLinkToResetPasswordToEmail(email)

    }

    @Get("/reset-password/:userId/:resetPasswordToken")
    public async checkTheLink(@Param("userId") userId:string,@Param("resetPasswordToken") resetPasswordToken:string) {
        await this.userServices.getResetPasswordLink(userId,resetPasswordToken) ;
        return {
            message:"valid link"
        }

    }

    @Post("reset-password")
    @HttpCode(HttpStatus.OK)
    public async resetPassword(@Body() dto:ResetPasswordDto) {
        return await this.userServices.resetNewPasswordInDb(dto)

    }






}

