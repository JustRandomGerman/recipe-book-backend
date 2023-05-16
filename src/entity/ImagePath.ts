import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { Recipe } from "./Recipe"

@Entity()
export class ImagePath {
    @PrimaryColumn()
    path: string

    @ManyToOne(() => Recipe, (recipe) => recipe.image_paths, {
        onDelete: "CASCADE"
    })
    recipe: Recipe
}
