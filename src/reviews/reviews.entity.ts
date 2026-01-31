/* eslint-disable prettier/prettier */
import { ProductEntity } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne,  PrimaryGeneratedColumn } from 'typeorm';

const defaultFn = () => {
    return "CURRENT_TIMESTAMP"


}

@Entity({ name: 'reviews' })
export class Review {

    @PrimaryGeneratedColumn()
    id!:number
    
    @Column({
        type:"int"
    })
    rating!:number
    
    @Column({type:"varchar"})
    comment!:string

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
    updatedAT!:Date
    

    @ManyToOne(()=>ProductEntity,(product)=>product.reviews,{onDelete:"CASCADE"})
    product!:ProductEntity


    @ManyToOne(()=>User,(user)=>user.reviews,{eager:true,onDelete:"CASCADE"})
    user!:User



    
}
