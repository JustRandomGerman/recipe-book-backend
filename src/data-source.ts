import "reflect-metadata"
import { DataSource } from "typeorm"
import { Recipe } from "./entity/Recipe"
import { Collection } from "./entity/Collection"
import { Ingredient } from "./entity/Ingredient"
import { Tag } from "./entity/Tag"
import { Keyword } from "./entity/Keyword"
import { ImagePath } from "./entity/ImagePath"
import { IngredientGroup } from "./entity/IngredientGroup"
import 'dotenv/config'

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Recipe, Collection, IngredientGroup, Ingredient, Tag, Keyword, ImagePath],
    migrations: [],
    subscribers: [],
})