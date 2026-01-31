/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing"
import { UserServices } from "./user.service"
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
    type findOneQueryType = {
        where:{
            email:string
        }
    }
describe("userService",() => {
    let userService:UserServices ;
    let userRepository: Repository<User>
    let Repository_Token = getRepositoryToken(User);
    const registerData : CreateUserDto = {
        username : "mohammed nabil",
        email:"mohammednabil1233@gmail.com",
        password:"123456789"

    }
    const findOneQuery : findOneQueryType = {
        where:{
            email:"mohammednabil1233@gmail.com",
        }
    }

    beforeEach(async()=> {
        const module : TestingModule = await Test.createTestingModule({
            providers :[ 
                UserServices ,
                {provide:JwtService,useValue:{}},
                {provide:MailService,useValue:{
                    verifyEmail:jest.fn(()=> {

                    })
                }},
                {provide:ConfigService,useValue:{
                    get:jest.fn(()=> {
                        return "123"
                    })
                },},
                {
                    provide:Repository_Token,
                    useValue:{
                        create:jest.fn((dto:CreateUserDto)=>{
                            return Promise.resolve(dto)

                        }),
                        findOne:jest.fn((query:findOneQueryType)=> {
                            

                        }),
                        save:jest.fn((dto:CreateUserDto)=> {
                            return {id:1,...dto}

                        })
                    }

                }
            ]
        }).compile()
        
        userService = module.get<UserServices>(UserServices);
        userRepository = module.get<Repository<User>>(Repository_Token)
    })

    describe(" 'userService' ",() => {
        it(" userService must be defined", ()=> {
            expect(userService).toBeDefined()


        })
    })

    describe(" 'createUser' ",() => {

        it(" save and findOne must be called",async()=> {
            await userService.createUser(registerData);
            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.save).toHaveBeenCalledTimes(1);


        })
        
    })

    
    
})