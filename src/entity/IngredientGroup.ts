import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Recipe } from "./Recipe"
import { Ingredient } from "./Ingredient"

@Entity()
export class IngredientGroup {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    position: number

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredient_groups, {
        onDelete: "CASCADE"
    })
    recipe: Recipe

    @OneToMany(() => Ingredient, (ingredient) => ingredient.ingredient_group, {
        eager: true,
        cascade: true
    })
    ingredients: Ingredient[]
}
