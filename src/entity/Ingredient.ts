import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Recipe } from "./Recipe"

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amount: string

    @Column()
    ingredient_name: string

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
        onDelete: "CASCADE"
    })
    recipe: Recipe
}
