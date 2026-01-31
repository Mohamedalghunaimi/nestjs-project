/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./reviews.entity";
import { Repository } from "typeorm";
import { ProductService } from "../products/product.service";
import { UserServices } from "../users/user.service";
import { CreateReviewDto } from "./dto/createReview.dto";
import { UpdateReviewDto } from "./dto/updateReview.dto";
import { UserType } from "../utilts/enum";
import { PayloadType } from "../users/types/types";

@Injectable() 
export class ReviewService {

    constructor(
        @InjectRepository(Review) private readonly reviewRepository:Repository<Review>,
        private readonly productService:ProductService,
        private readonly userService:UserServices,
    ) {}


    public async createReview({productId , userId , dto}:{productId:number,userId:number,dto:CreateReviewDto}) {

        const product = await this.productService.getOneBy(productId);

        const user = await this.userService.getCurrentUser(userId.toString());

        const newReview = this.reviewRepository.create({
            product,
            user,
            ...dto,
            

        });
        const savedReview = await this.reviewRepository.save(newReview);

        return {
            ...savedReview,
            userId,
            productId

        }



    }

    public async getAll(
        skip:number,
        reviewsPerPage:number

    ): Promise<Review[]> {
        const reviews = await this.reviewRepository.find({
            take:reviewsPerPage,
            skip,
            order:{
                createdAt :"DESC"
            }
        });

        return reviews ;
    }

    public async update({reviewId,userId,data}:{reviewId:number,userId:number,data:UpdateReviewDto}) {
        const review = await this.getReviewById(reviewId);
        if(userId.toString()!==review.user.id) {
            throw new ForbiddenException("you are not allowed")
        }
        review.comment = data.comment ?? review.comment;
        review.rating = data.rating ?? review.rating;
        return await this.reviewRepository.save(review)


    }

    public async delete({reviewId,user}:{reviewId:number,user:PayloadType}) {
        const review = await this.getReviewById(reviewId)
        if(review.user.id !== user.id && (user.userType!==UserType.admin)) {
            throw new ForbiddenException("you are not allowed")
        }
        return review

    }


    private async getReviewById(id :number) {
        try {
            const review = await this.reviewRepository.findOne({
                where:{
                    id
                }
            });
            if(!review) {
                throw new NotFoundException("user not found");
            }
            return review;
        } catch (error) {
            console.log(error)
            throw new NotFoundException("user not found");
        }

    }

}


