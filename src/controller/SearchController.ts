import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from "express";
import { Recipe } from '../entity/Recipe';
import { ImagePath } from '../entity/ImagePath';

export class SearchController {

    private recipeRepository = AppDataSource.getRepository(Recipe);
    private baseImagePath = "http://localhost:3000/images/";

    async search(request: Request, response: Response, next: NextFunction) {
        const { query, mode, tags} = request.body;

        //TODO validate parameters
        //response.status(400).json({message: "incorrect parameters"})

        if(mode === 'recipe'){
            return this.searchRecipe(query, tags);
        }
        else if(mode === 'ingredient'){
            return this.searchIngredient(query, tags);
        }
        else{
            response.status(400).json({message: `${mode} is not a supported search mode`});
        }
    }

    async searchRecipe(query: string, tags: string[]){
        const recipes = await this.recipeRepository
            .createQueryBuilder("recipe")
            .where("recipe.name LIKE :name", {name: `%${query}%`})
            /*.andWhere("recipe.tags")*/
            /*.orWhere("recipe.keywords)*/
            .getMany();
        
            recipes.map((recipe: Recipe) => {
                recipe.image_paths.map((imagePath : ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);
            });
        return recipes;
    }

    async searchIngredient(query: string, tags: string[]){

    }

}