/* eslint-disable prettier/prettier */
import { Review } from "../reviews/reviews.entity"
import { User } from "../users/user.entity"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm"
const defaultFn = () => {
    return "CURRENT_TIMESTAMP"


}

@Entity({name:'products'})
export class ProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number 



    @Column()
    description! : string 


    @Column({/*type:"varchar",length:150*/})
    title! : string 

    @Column({type:"float"})
    price!:number 
    

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

    @OneToMany(()=> Review,(review)=> review.product,{eager:true})
    reviews!:Review[]

    @ManyToOne(()=>User,(user)=>user.products,{eager:true})
    user!:User











}
