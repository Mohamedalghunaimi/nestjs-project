/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { RolesGurad } from 'src/users/guards/RolesGuard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { UserType } from 'src/utilts/enum';
import { PayloadType } from 'src/users/types/types';
import { currentUserDecorator } from 'src/users/decorators/currentUser.decorator';
import { CreateReviewDto } from './dto/createReview.dto';
import { Review } from './reviews.entity';
import { UpdateReviewDto } from './dto/updateReview.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

@Controller("/api/reviews")
export class ReviewController {

    constructor(private readonly reviewService:ReviewService) {}

    @Post(":productId")
    @UseGuards(RolesGurad)
    @Roles(UserType.admin,UserType.normal)


    public async createReview(
    @Param("productId",ParseIntPipe) productId:number,
    @currentUserDecorator() user:PayloadType,
    @Body() dto:CreateReviewDto) : Promise<Review> {
        const newReview = await this.reviewService.createReview(
            {
                productId,
                dto,
                userId:parseInt(user.id)
            }
        )
        return newReview ;
    }

    @Get()
    @UseGuards(RolesGurad)
    @Roles(UserType.admin)
    public async getAllReviews(
        @Query("reviewPerPge",ParseIntPipe) reviewPerPge:number,
        @Query("pageNumber",ParseIntPipe) pageNumber : number
    ): Promise<Review[]> {
        const skip = (pageNumber - 1) * reviewPerPge ;
        const reviews = await this.reviewService.getAll(skip,pageNumber);
        return reviews
    }


    @Put(":reviewId") 
    @UseGuards(RolesGurad)
    @Roles(UserType.admin)


    public async updateReview(
    @Param("reviewId",ParseIntPipe) reviewId:number,
    @currentUserDecorator() user:PayloadType,
    @Body() data:UpdateReviewDto
    ) {
        const review = await this.reviewService.update({
            reviewId,
            userId:parseInt(user.id),
            data
        })
        return {
            message:    `review with id =>${review.id} updated`
        }


    }

    @Delete(":reviewId")
    @UseGuards(RolesGurad)
    @Roles(UserType.admin,UserType.normal) 

    public async deleteReview(
    @Param("reviewId",ParseIntPipe) reviewId:number,
    @currentUserDecorator() user:PayloadType,
    ) {
        const review = await this.reviewService.delete({
            reviewId,
            user
        })
        return {
            message:    "review is deleted" + review.id
        }


    }




}
