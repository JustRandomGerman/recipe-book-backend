import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Recipe } from "./Recipe"

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Recipe, (recipe) => recipe.tags)
    recipe: Recipe
}
