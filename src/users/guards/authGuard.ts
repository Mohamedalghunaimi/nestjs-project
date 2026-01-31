/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-const */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PayloadType } from '../types/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const authorization  = request.headers.authorization;
    if(!authorization) {
      throw new UnauthorizedException('Authorization header missing');
    }


    const token = authorization.split(' ')[1];
    const type =  authorization.split(' ')[0];

    if(!token || type !== 'Bearer') {
      throw new UnauthorizedException('token must be provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      (request as any)["user"] = payload;
      return true;
    } catch (error) {

      throw new UnauthorizedException('Invalid or expired token')
      
    }

  }
}
