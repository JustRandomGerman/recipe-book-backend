import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Recipe } from "./Recipe"
import { IngredientGroup } from "./IngredientGroup"

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    amount: string

    @Column()
    ingredient_name: string

    //@Column()
    //position: number

    @ManyToOne(() => IngredientGroup, (ingredient_group) => ingredient_group.ingredients, {
        onDelete: "CASCADE"
    })
    ingredient_group: IngredientGroup
}
