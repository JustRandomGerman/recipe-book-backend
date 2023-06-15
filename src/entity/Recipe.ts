import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./Ingredient";
import { Tag } from "./Tag";
import { Keyword } from "./Keyword";
import { ImagePath } from "./ImagePath";
import { Collection } from "./Collection";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column("text")
    instructions: string

    @Column({type: "timestamp", nullable: true})
    last_viewed: Date

    @OneToMany(() => ImagePath, (imagePath) => imagePath.recipe, {
        eager: true,
        cascade: true
    })
    image_paths: ImagePath[]

    @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, {
        eager: true,
        cascade: true
    })
    ingredients: Ingredient[]

    @OneToMany(() => Tag, (tag) => tag.recipe, {
        eager: true,
        cascade: true
    })
    tags: Tag[]

    @OneToMany(() => Keyword, (keyword) => keyword.recipe, {
        eager: true,
        cascade: true
    })
    keywords: Keyword[]

    @ManyToMany(() => Collection, (collection) => collection.recipes)
    collections: Collection[]
}
