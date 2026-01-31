/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,

} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/utilts/enum';
import { Request } from 'express';
import { PayloadType } from '../types/types';


@Injectable()
export class RolesGurad implements CanActivate {
    constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflactor:Reflector
    ) {}
    async canActivate(context: ExecutionContext) {

        const roles  : UserType[] = this.reflactor.getAllAndOverride("roles",
            [
            context.getHandler(),
            context.getClass()
            ]
        )
        const request :Request = context.switchToHttp().getRequest();
        const authorization  = request.headers.authorization;
        if(!authorization) {
            throw new UnauthorizedException('Authorization header missing');
        }

        const accessToken = authorization.split(" ")[1] ;
        const schema = authorization.split(" ")[0] ;



        if(!accessToken || schema!="Bearer") {
            throw new UnauthorizedException("headers token must be provided")
        }
        try {
            const user : PayloadType = await this.jwtService.verifyAsync(accessToken);
            const accessFlageForRoles : boolean = roles.includes(user.userType) ;
            if(!accessFlageForRoles) {
                throw new UnauthorizedException("unAuthorized")
            }
            (request as any)["user"] = user
            



        } catch (error) {
            console.log(error)
            throw new UnauthorizedException("invalid or expired token")
        }

        return true


        
        
        
    }

}