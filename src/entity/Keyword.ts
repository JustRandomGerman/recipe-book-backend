import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Recipe } from "./Recipe"

@Entity()
export class Keyword{
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    keyword_name: string

    @ManyToOne(() => Recipe, (recipe) => recipe.keywords, {
        onDelete: "CASCADE"
    })
    recipe: Recipe
}