import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./Ingredient";
import { Tag } from "./Tag";
import { Keyword } from "./Keyword";
import { ImagePath } from "./ImagePath";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column("text")
    instructions: string

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
        cascade: true,
        onDelete: "CASCADE"
    })
    tags: Tag[]

    @OneToMany(() => Keyword, (keyword) => keyword.recipe, {
        eager: true,
        cascade: true,
        onDelete: "CASCADE"
    })
    keywords: Keyword[]
}
