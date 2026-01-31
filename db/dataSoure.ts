/* eslint-disable prettier/prettier */
import { config } from "dotenv";
import { ProductEntity } from "../src/products/product.entity";
import { Review } from "../src/reviews/reviews.entity";
import { User } from "../src/users/user.entity";
import { DataSourceOptions,DataSource } from "typeorm";
config({path:".env"})

export const dataSourceOptions :DataSourceOptions = {
    type:"postgres",
    url:process.env.DB_url,
    entities:[User,ProductEntity,Review],
    migrations:['dist/db/migrations/*.js']
    
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;