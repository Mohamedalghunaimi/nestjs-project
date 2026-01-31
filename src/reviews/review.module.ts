/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity';
import { ReviewService } from './review.service';
import { ProductModule } from '../products/product.module';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [ReviewController],
  imports:[TypeOrmModule.forFeature([Review]),ProductModule,UserModule],
  providers:[ReviewService],
  exports :[ReviewService]
})
export class ReviewModule {}
