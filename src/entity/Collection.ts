import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany,  } from "typeorm"
import { Recipe } from "./Recipe"

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @ManyToMany(() => Recipe)
    @JoinTable({
        name: "collection_recipes",
        joinColumn: {
            name: "collection_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "recipe_id",
            referencedColumnName: "id"
        }
    })
    recipes: Recipe[]
}
