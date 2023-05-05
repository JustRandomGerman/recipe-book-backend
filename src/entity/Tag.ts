import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Recipe } from "./Recipe"

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    tag_name: string

    @ManyToOne(() => Recipe, (recipe) => recipe.tags, {
        onDelete: "CASCADE"
    })
    recipe: Recipe
}
