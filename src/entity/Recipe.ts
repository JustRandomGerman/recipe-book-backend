import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Ingredient } from "./Ingredient"
import { Tag } from "./Tag"

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column("text")
    instructions: string

    @Column()
    image: string

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
}
