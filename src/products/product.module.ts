/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { ProductEntity } from './product.entity';
import { UserModule } from 'src/users/user.module';

@Module({
  controllers: [ProductController],
  providers :[ProductService],
  imports :[ TypeOrmModule.forFeature([ProductEntity]), UserModule ],
  exports :[ProductService]
})
export class ProductModule {}
