/* eslint-disable prettier/prettier */

import { Exclude } from "class-transformer";
import { ProductEntity } from "../products/product.entity";
import { Review } from "../reviews/reviews.entity";
import { UserType } from "../utilts/enum";
import { Column, Entity, OneToMany,  PrimaryGeneratedColumn } from "typeorm";


const defaultFn = () => {
    return "CURRENT_TIMESTAMP"


}

@Entity({name:"users"})
export class User {
    
    @PrimaryGeneratedColumn()
    id!:string
    
    @Column({type:"varchar"})
    username!:string
    
    @Column({type:"varchar" ,unique :true})
    email!:string
    
    @Column()
    @Exclude()
    password!:string
    
    @Column({ type:"enum" , enum: UserType , default :UserType.admin})
    userType!:UserType

    @Column({default:false})
    accountVerified! : boolean

    @Column({nullable:true})
    verificationToken!:string


    @Column({nullable:true})
    resetPasswordToken!:string


    @Column({
        type:"timestamp",
        default : defaultFn
    })
    createdAt! : Date


    @Column({
        type:"timestamp",
        default : defaultFn,
        onUpdate : "CURRENT_TIMESTAMP"
    })
    updatedAt! : Date

    @OneToMany(()=>ProductEntity,(product)=>product.user)
    products!:ProductEntity[]

    @OneToMany(()=>Review,(review)=>review.user)
    reviews!:Review[]

    @Column({
        nullable:true,
        default:null
    })
    profileImage!: string

    @Column({
        nullable: true,
        default: null
    })
    profileImageId!: string ;

}

