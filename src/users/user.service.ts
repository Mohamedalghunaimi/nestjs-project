/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import bcrypt from "bcryptjs";
import { LoginUserDto } from "./dto/loginUser.dto";
import { JwtService } from "@nestjs/jwt";
import {  PayloadType } from "./types/types";
import { UpdateUserDto } from "./dto/UpdateUser.dto";
import { UserType } from "src/utilts/enum";
import { join } from "path";
import { unlinkSync } from "fs";
import { MailService } from "src/mail/mail.service";
import { randomBytes } from "crypto";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordDto } from "./dto/resetPassword.dto";

@Injectable()
export class UserServices {
    

    constructor(
        @InjectRepository(User)
        private readonly userRepostitory : Repository<User>,
        private readonly jwtService: JwtService,
        private readonly mailService : MailService,
        private readonly configService:ConfigService
    ) {
    }

    public async createUser(createUserDto:CreateUserDto): Promise<{ message: string; }> {

        const {username,email,password} = createUserDto;
        const existedUser = await this.userRepostitory.findOne({
            where:{
                email
            }
        })
        if(existedUser) {
            throw new BadRequestException("user is already exists");
        }


        const hashedPassword = await this.hashPassword(password)

        let newUser = this.userRepostitory.create({
            username,
            password: hashedPassword,
            email,
            verificationToken:randomBytes(32).toString("hex")
        })

        newUser = await this.userRepostitory.save(newUser)
        const link = this.generateLink(newUser.id,newUser.verificationToken)

        ///await this.mailService.verifyEmail(link,email)

        return  {message:"please check your email"}
        
        


            
        
    }

    public async userLogin (loginUserDto:LoginUserDto)  {
        const {email,password} = loginUserDto;
        const user = await this.userRepostitory.findOne({
            where:{
                email
            }
        });
        if(!user) {
            throw new NotFoundException("user not found");
        }
        const passwordIsEqual = await bcrypt.compare(password,user.password)
        if(!passwordIsEqual) {
            throw new BadRequestException("Invalid email or password");
        }
        /*
        if(!user.accountVerified) {
            let verificationToken =user.verificationToken

            if(!verificationToken) {
                user.verificationToken = randomBytes(32).toString("hex")
                const result = await this.userRepostitory.save(user);
                verificationToken = result.verificationToken;
            } 
            const link = this.generateLink(user.id,user.verificationToken)
            await this.mailService.verifyEmail(link,email)
            return {
                message: "please check your email"
            }
        }*/
        const payload :PayloadType = {email,userType:user.userType,id:user.id};
        const accessToken = await this.generateToken(payload);

        return {accessToken};
            
        


    }

    public async getCurrentUser(id:string) {
        const user = await this.userRepostitory.findOne({
            select :{
                password:false
            },
            where: {
                id 
            }
    });
        if(!user) {
            throw new NotFoundException("user not found")
        }
        

        return user;
    }

    public async getAll() :Promise<User[]> {
        const users = await this.userRepostitory.find({
            select :{
                password : false
            }
        })
        return users;
    }

    public async updateUser(id:string,body:UpdateUserDto) :Promise<User> {
        const {username,password} = body ;

        const  user: User = await this.getCurrentUser(id) ;
        user.username = username ?? user.username ;
        if(password) {
            const salt = await bcrypt.genSalt(10) ;
            const hashedPassword = await bcrypt.hash(password,salt)
            user.password = hashedPassword ;
        } 
        const savedUser : User = await this.userRepostitory.save(user)
        return savedUser ;
        


    }

    public async deleteUser({id,payload}:{id:string,payload:PayloadType}):Promise<User> {

        if((payload.id!==id)&&(payload.userType!==UserType.admin)) {
            throw new UnauthorizedException("unauthorized")


        }
        const  user: User = await this.getCurrentUser(id) ;
        const deletedUser = await this.userRepostitory.remove(user);
        return deletedUser; 



    }

    public async setProfileImage(
        profileImage:string,
        userId:number

    ) {

        const user = await this.getCurrentUser(userId.toString())
        if(user.profileImage) {
            await this.removeImage(userId)
            user.profileImage =  profileImage  ;
        } else {
            user.profileImage =  profileImage  ;
        }
        const savedUser = await this.userRepostitory.save(user);
        return savedUser ;
    }

    public async removeImage(userId:number) {
        const user = await this.getCurrentUser(userId.toString());
        if(!user.profileImage) {
            throw new BadRequestException('image is already removed')
        }
        const imagePath = join(process.cwd(),`../../images/user/${user.profileImage}`);
        unlinkSync(imagePath)
        user.profileImage = "";
        return await this.userRepostitory.save(user) 


    }

    public async verifyEmail(userId:string,verifyToken:string) {
        const user = await this.getCurrentUser(userId);

        if(user.accountVerified) {
            throw new BadRequestException("user is already verified");
        }
        if(user.verificationToken) {
            throw new  BadRequestException("there is no token");
        }
        if(user.verificationToken!==verifyToken) {
            throw new BadRequestException("token is invalid");

        }
        user.accountVerified = true;
        user.verificationToken = ""
        return user;
        
    }

    public async sendLinkToResetPasswordToEmail(email:string) {
        try {
            const user = await this.userRepostitory.findOne({
                where:{email}
            });
            if(!user) {
                throw new BadRequestException("invalid email");
            }
            user.resetPasswordToken = randomBytes(32).toString("hex");
            const savedUser = await this.userRepostitory.save(user);
            const clientDomain = this.configService.get<string>("CLIENT_DOMAIN");
            const link = `${clientDomain}/reset-password/${savedUser.id}/${savedUser.resetPasswordToken}`;
            await this.mailService.sendResetPasswordTemplate(email,link);
            return {
                message:"please check your email" 
            }

            
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException()
        }

    }

    public async getResetPasswordLink(userId:string,resetPasswordToken:string) {
        try {
            const user = await this.userRepostitory.findOne({where:{id:userId}});
            if(!user) {
                throw new BadRequestException("invalid link")
            }
            if(user.resetPasswordToken!==resetPasswordToken || !user.resetPasswordToken || !resetPasswordToken ) {
                throw new BadRequestException("invalid link")

            }
            return user ;

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException()
        }
    }

    public async resetNewPasswordInDb(dto:ResetPasswordDto) {
        const {id , resetPasswordToken ,newPassword } = dto ;
        try {
            const user = await this.getResetPasswordLink(id,resetPasswordToken);
            const hashedPassword = await this.hashPassword(newPassword);
            user.resetPasswordToken = '' ;
            user.password = hashedPassword ;
            await this.userRepostitory.save(user);
            return {
                message:"password is changed successfully !"
            }

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException()

        }
    }


    private async  generateToken(payload:PayloadType):Promise<string> {
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken;
    }

    private generateLink(userId:string,verificationToken:string) {
        const domain = this.configService.get<string>("DOMAIN")
        const link = `${domain}/api/auth/verify-email/${userId}/${verificationToken}`;
        return link
    }

    private async hashPassword(password :string) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword
    }
    

}