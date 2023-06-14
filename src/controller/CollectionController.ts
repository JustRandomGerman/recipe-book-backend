import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from "express";
import { Collection } from "../entity/Collection";
import { Recipe } from '../entity/Recipe';
import { ImagePath } from '../entity/ImagePath';
import * as Joi from 'joi';

export class CollectionController {

    private collectionRepository = AppDataSource.getRepository(Collection);
    private recipeRepository = AppDataSource.getRepository(Recipe);
    private baseImagePath = "http://localhost:3000/images/";

    private collectionSchema = Joi.object({
        name: Joi.string().required()
    })

    async all(request: Request, response: Response, next: NextFunction) {
        return this.collectionRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        // Check if ID is a valid number
        if (isNaN(id)) {
            response.status(400).json({ message: "The ID must be a valid number" });
            return;
        }

        const collection = await this.collectionRepository.findOne({relations: {
            recipes: true
        },
        where: {
            id: id
        }});
        
        if (!collection) {
            response.status(404).json({message: "The collection could not be found"});
            return;
        }

        collection.recipes.map((recipe: Recipe) => {
            recipe.image_paths.map((imagePath: ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);
        });

        return collection;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { name } = request.body;

        //validate parameters
        const { error } = this.collectionSchema.validate(request.body);
        if (error) {
            response.status(400).json({ message: error.details });
            return;
        }

        const collection = Object.assign(new Collection(), {
            name
        });

        return this.collectionRepository.save(collection);
    }

    async update(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);

        // Check if ID is a valid number
        if (isNaN(id)) {
            response.status(400).json({ message: "The ID must be a valid number" });
            return;
        }

        const { name } = request.body;
        
        //validate parameters
        const { error } = this.collectionSchema.validate(request.body);
        if (error) {
            response.status(400).json({ message: error.details });
            return;
        }

        let collection = await this.collectionRepository.findOneBy({ id });

        if (!collection) {
            response.status(404).json({message: "The collection could not be found"});
            return;
        }

        collection.name = name;

        return this.collectionRepository.save(collection);
    }

    async addRecipe(request: Request, response: Response, next: NextFunction){
        const collection_id = parseInt(request.params.collection_id);
        const recipe_id = parseInt(request.params.recipe_id);

        //check if id's are really numbers
        if(isNaN(collection_id) || isNaN(recipe_id)){
            response.status(400).json({message: "Both IDs must be a number"});
            return;
        }

        // Fetch the collection and recipe entities
        const collection = await this.collectionRepository.findOne({relations: {
            recipes: true
        },
        where: {
            id: collection_id
        }});
        let recipe = await this.recipeRepository.findOneBy({
            id: recipe_id
        });
      
        if (!collection || !recipe) {
            // Either collection or recipe does not exist
            response.status(404).json({message: "The recipe or collection could not be found"});
            return;
        }
      
        // Add the recipe to the collection
        collection.recipes.push(recipe);
      
        return this.collectionRepository.save(collection);
    }

    async removeRecipe(request: Request, response: Response, next: NextFunction) {
        const collection_id = parseInt(request.params.collection_id);
        const recipe_id = parseInt(request.params.recipe_id);
      
        // Check if IDs are valid numbers
        if (isNaN(collection_id) || isNaN(recipe_id)) {
            response.status(400).json({ message: "Both IDs must be numbers" });
            return;
        }
      
        // Fetch the collection and recipe entities
        const collection = await this.collectionRepository.findOne({relations: {
            recipes: true
        },
        where: {
            id: collection_id
        }});
        let recipe = await this.recipeRepository.findOneBy({
            id: recipe_id
        });
      
        if (!collection || !recipe) {
            // Either collection or recipe does not exist
            response.status(404).json({ message: "The recipe or collection could not be found" });
            return;
        }
      
        // Remove the recipe from the collection
        collection.recipes = collection.recipes.filter((rec) => rec.id !== recipe.id);
      
        return this.collectionRepository.save(collection);
    }
      

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        // Check if ID is a valid number
        if (isNaN(id)) {
            response.status(400).json({ message: "The ID must be a valid number" });
            return;
        }

        let collection = await this.collectionRepository.findOneBy({ id });

        if (!collection) {
            response.status(404).json({message: "The collection could not be found"});
            return;
        }

        await this.collectionRepository.remove(collection);

        response.status(200).json({message: "Successfully deleted collection"});
        return;
    }

}