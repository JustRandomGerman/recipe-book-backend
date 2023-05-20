import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response, response } from "express";
import { Recipe } from '../entity/Recipe';
import { ImagePath } from '../entity/ImagePath';
import * as Joi from 'joi';

export class SearchController {

    private recipeRepository = AppDataSource.getRepository(Recipe);
    private baseImagePath = "http://localhost:3000/images/";

    private searchSchema = Joi.object({
        query: Joi.string().required(),
        mode: Joi.string().lowercase().valid("recipe", "ingredient").required(),
        tags: Joi.array().items(Joi.string())//TODO ? add check for all available ingredients
    })

    async search(request: Request, response: Response, next: NextFunction) {
        const { query, mode, tags} = request.body;

        const { error } = this.searchSchema.validate(request.body);
        if (error) {
            response.status(400).json({ message: error.details });
            return;
        }

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
        //join all additional columns to the recipe
        .leftJoinAndSelect("recipe.image_paths", "image_path")
        .leftJoinAndSelect("recipe.keywords", "keyword")
        .leftJoinAndSelect("recipe.ingredients", "ingredient")
        .leftJoinAndSelect("recipe.tags", "tag")
        //search for recipes with matching name
        .where("recipe.name LIKE :name", { name: `%${query}%` })
        //search for recipes with matching keywords
        .orWhere("keyword.keyword_name LIKE :keyword", { keyword: `%${query}%` })
        .getMany();

        //if there are filter tags only get recipes with those tags
        if (tags.length > 0) {
            const filteredRecipes = recipes.filter((recipe) => {
                return tags.every((tag) => recipe.tags.some((recipeTag) => recipeTag.tag_name === tag));
            });
        
            if (filteredRecipes.length === 0) {
                response.status(404).json({message: "No recipes could be found using your search criteria. Try a different query or remove some filter tags"});
                return;
            }
        
            filteredRecipes.forEach((recipe) => {
                recipe.image_paths.forEach( (imagePath: ImagePath) =>
                    (imagePath.path = this.baseImagePath + imagePath.path)
                );
            });
        
            return filteredRecipes;
        }

        if (recipes.length === 0) {
            response.status(404).json({message: "No recipes could be found using your search criteria. Try a different query or remove some filter tags"});
            return;
        }
        
        recipes.forEach((recipe: Recipe) => {
            recipe.image_paths.forEach( (imagePath: ImagePath) =>
                (imagePath.path = this.baseImagePath + imagePath.path)
            );
        });

        return recipes;
    }

    async searchIngredient(query: string, tags: string[], response: Response){
        const queryBuilder = await this.recipeRepository
        .createQueryBuilder("recipe")
        //join all additional columns to the recipe
        .leftJoinAndSelect("recipe.image_paths", "image_path")
        .leftJoinAndSelect("recipe.keywords", "keyword")
        .leftJoinAndSelect("recipe.ingredients", "ingredient")
        .leftJoinAndSelect("recipe.tags", "tag")
        //search for recipes containing an ingredient
        .where("ingredient.ingredient_name LIKE :ingredient", { ingredient: `%${query}%` });

        //if there are filter tags only get recipes with those tags
        if (tags.length > 0) {
            tags.forEach((tag) => {
                queryBuilder.andWhere("EXISTS (SELECT 1 FROM tag t WHERE t.recipeId = recipe.id AND t.tag_name = :tag)", { tag });
            });
        }

        const recipes = await queryBuilder.getMany();

        //if there are filter tags only get recipes with those tags
        /*if (tags.length > 0) {
            const filteredRecipes = recipes.filter((recipe) => {
                return tags.every((tag) => recipe.tags.some((recipeTag) => recipeTag.tag_name === tag));
            });
        
            if (filteredRecipes.length === 0) {
                response.status(404).json({message: "No recipes could be found using your search criteria. Try a different query or remove some filter tags"});
                return;
            }
        
            filteredRecipes.forEach((recipe) => {
                recipe.image_paths.forEach( (imagePath: ImagePath) =>
                    (imagePath.path = this.baseImagePath + imagePath.path)
                );
            });
        
            return filteredRecipes;
        }*/

        if (recipes.length === 0) {
            response.status(404).json({message: "No recipes could be found using your search criteria. Try a different query or remove some filter tags"});
            return;
        }
        
        recipes.forEach((recipe: Recipe) => {
            recipe.image_paths.forEach( (imagePath: ImagePath) =>
                (imagePath.path = this.baseImagePath + imagePath.path)
            );
        });

        return recipes;
    }

}