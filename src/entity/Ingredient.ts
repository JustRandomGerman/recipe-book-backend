import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Recipe } from "./Recipe"

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amount: string

    @Column()
    name: string

    @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
    recipe: Recipe
}
