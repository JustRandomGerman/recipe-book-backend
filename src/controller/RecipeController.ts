import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Recipe } from "../entity/Recipe"

export class RecipeController {

    private recipeRepository = AppDataSource.getRepository(Recipe)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.recipeRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);


        const recipe = await this.recipeRepository.findOne({
            where: { id }
        });

        if (!recipe) {
            response.status(404).json({message: "the specified recipe does not exist"})
        }
        return recipe;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { name, instructions, image, ingredients, tags } = request.body;

        //TODO validate parameters
        //response.status(400).json({message: "the request parameters are incorrect"})

        const recipe = Object.assign(new Recipe(), {
            name,
            instructions,
            image,
            ingredients,
            tags
        });

        return this.recipeRepository.save(recipe);
    }

    async update(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        const { name, instructions, image, ingredients, tags } = request.body;

        //TODO validate parameters
        //response.status(400).json({message: "the request parameters are incorrect"})
        
        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            response.status(404).json({message: "the specified recipe does not exist"})
        }

        recipe.name = name;
        recipe.instructions = instructions;
        recipe.image = image;
        recipe.ingredients = ingredients;
        recipe.tags = tags;

        return this.recipeRepository.save(recipe)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            response.status(404).json({message: "the specified recipe does not exist"})
        }

        await this.recipeRepository.remove(recipe);

        response.status(200)
    }
}