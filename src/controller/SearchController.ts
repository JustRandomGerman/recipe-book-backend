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
        //Match everything in the query in double quotes
        const regex = /"(.*?)"/g;
        const matches = query.match(regex) || [];
      
        // Remove the quotation marks from the matches, but really only the first one will be used
        const extractedQuery = matches.map(match => match.replace(/"/g, ''));


        //create sql query
        const queryBuilder = this.recipeRepository
        .createQueryBuilder("recipe")
        //join all additional columns to the recipe
        .leftJoinAndSelect("recipe.image_paths", "image_path")
        .leftJoinAndSelect("recipe.keywords", "keyword")
        .leftJoinAndSelect("recipe.ingredient_groups", "ingredient_group")
        .leftJoinAndSelect("recipe.tags", "tag")

        //search for recipes with a certain name or keyword
        if(extractedQuery.length === 0){
            //no text in quotation marks, so characters before the query are allowed
            queryBuilder.where("recipe.name LIKE :name", { name: `%${query}%` })
            .orWhere("keyword.keyword_name LIKE :keyword", { keyword: `%${query}%` })
        }
        else{
            //text in quotation marks, do not allow characters before and after query
            queryBuilder.where("recipe.name LIKE :name", { name: `${extractedQuery}` })
            .orWhere("keyword.keyword_name LIKE :keyword", { keyword: `${extractedQuery}` })
        }
        
        const recipes = await queryBuilder.getMany();


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
        
        //finish recipe image paths
        recipes.forEach((recipe: Recipe) => {
            recipe.image_paths.forEach( (imagePath: ImagePath) =>
                (imagePath.path = this.baseImagePath + imagePath.path)
            );
        });

        return recipes;
    }

    async searchIngredient(query: string, tags: string[], response: Response){
        //Match everything in the query in double quotes
        const regex = /"(.*?)"/g;
        const matches = query.match(regex) || [];
      
        // Remove the quotation marks from the matches, but really only the first one will be used
        const extractedQuery = matches.map(match => match.replace(/"/g, ''));
        

        //create sql query
        const queryBuilder = this.recipeRepository
        .createQueryBuilder("recipe")
        //join all additional columns to the recipe
        .leftJoinAndSelect("recipe.image_paths", "image_path")
        .leftJoinAndSelect("recipe.keywords", "keyword")
        .leftJoinAndSelect("recipe.ingredient_groups", "ingredient_group")
        .leftJoinAndSelect("recipe.tags", "tag");
        
        //search for recipes containing an ingredient
        if(extractedQuery.length === 0){
            //no text in quotation marks, so characters before the query are allowed
            queryBuilder.where("ingredient.ingredient_name LIKE :ingredient", { ingredient: `%${query}%` });
        }
        else{
            //text in quotation marks, do not allow characters before and after query
            queryBuilder.where("ingredient.ingredient_name LIKE :ingredient", { ingredient: `${extractedQuery}` });
        }

        //if there are filter tags only get recipes with those tags
        if (tags.length > 0) {
            tags.forEach((tag) => {
                queryBuilder.andWhere("EXISTS (SELECT 1 FROM tag t WHERE t.recipeId = recipe.id AND t.tag_name = :tag)", { tag });
            });
        }

        const recipes = await queryBuilder.getMany();

        if (recipes.length === 0) {
            response.status(404).json({message: "No recipes could be found using your search criteria. Try a different query or remove some filter tags"});
            return;
        }
        
        //finish recipe image paths
        recipes.forEach((recipe: Recipe) => {
            recipe.image_paths.forEach( (imagePath: ImagePath) =>
                (imagePath.path = this.baseImagePath + imagePath.path)
            );
        });

        return recipes;
    }

}