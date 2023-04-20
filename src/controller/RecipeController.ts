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
            return "this recipe does not exist"
        }
        return recipe;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        const recipe = Object.assign(new Recipe(), {
            firstName,
            lastName,
            age
        });

        return this.recipeRepository.save(recipe);
    }

    async update(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        
        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            return "this recipe does not exist"
        }

        //TODO

    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            return "this recipe does not exist"
        }

        await this.recipeRepository.remove(recipe);

        return "recipe has been removed";
    }

}