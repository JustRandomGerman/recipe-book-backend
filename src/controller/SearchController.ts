import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response, response } from "express";
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
            return this.searchRecipe(query, tags, response);
        }
        else if(mode === 'ingredient'){
            return this.searchIngredient(query, tags, response);
        }
        else{
            response.status(400).json({message: `${mode} is not a supported search mode`});
        }
    }

    async searchRecipe(query: string, tags: string[], response: Response){
        const recipes = await this.recipeRepository
        .createQueryBuilder("recipe")
        //join all the addtional columns to the recipe
        .leftJoinAndSelect("recipe.image_paths", "image_path")
        .leftJoinAndSelect("recipe.keywords", "keyword")
        .leftJoinAndSelect("recipe.ingredients", "ingredient")
        .leftJoinAndSelect("recipe.tags", "tag")
        //search for recipes with matching name
        .where("recipe.name LIKE :name", { name: `%${query}%` })
        //search for recipes with matching keywords
        .orWhere("keyword.keyword_name LIKE :keyword", { keyword: `%${query}%` })
        .getMany();
        
        if(recipes.length === 0){
            response.status(404).json({message: "No recipes could be found using your search criteria. Try a different query or remove some filter tags"});
            return;
        }

        //finish all the paths to images on the server
        recipes.map((recipe: Recipe) => {
            recipe.image_paths.map((imagePath : ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);
        });

        return recipes;
    }

    async searchIngredient(query: string, tags: string[], response: Response){

    }

}