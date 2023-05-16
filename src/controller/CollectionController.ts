import { AppDataSource } from '../data-source';
import { In } from 'typeorm';
import { NextFunction, Request, Response } from "express";
import { Collection } from "../entity/Collection";
import { Recipe } from '../entity/Recipe';

export class CollectionController {

    private collectionRepository = AppDataSource.getRepository(Collection);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.collectionRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);


        const collection = await this.collectionRepository.findOne({
            where: { id }
        });

        if (!collection) {
            response.status(404).json({message: "test"});
            return;
        }
        return collection;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { name, recipes } = request.body;

        //TODO validate parameters
        //response.status(400).json({message: "the request parameters are incorrect"})
        //return

        const collection = Object.assign(new Collection(), {
            name,
            recipes
        });

        return this.collectionRepository.save(collection);
    }

    async update(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        const { name, recipes } = request.body;
        
        //TODO validate parameters
        //response.status(400).json({message: "the request parameters are incorrect"})
        //return

        let collection = await this.collectionRepository.findOneBy({ id });

        if (!collection) {
            response.status(404).json({message: "the specified collection does not exist"});
            return;
        }

        collection.name = name;
        const recipeRepository = AppDataSource.getRepository(Recipe);
        const updatedRecipes = await recipeRepository.find({ where: {id: In(recipes) }});
        collection.recipes = updatedRecipes;

        return this.collectionRepository.save(collection);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let collection = await this.collectionRepository.findOneBy({ id });

        if (!collection) {
            response.status(404).json({message: "the specified collection does not exist"});
            return;
        }

        await this.collectionRepository.remove(collection);

        response.status(200);
        return;
    }

}