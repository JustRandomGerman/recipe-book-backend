import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Collection } from "../entity/Collection"

export class CollectionController {

    private collectionRepository = AppDataSource.getRepository(Collection)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.collectionRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);


        const collection = await this.collectionRepository.findOne({
            where: { id }
        });

        if (!collection) {
            return "this collection does not exist"
        }
        return collection;
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        const collection = Object.assign(new Collection(), {
            firstName,
            lastName,
            age
        });

        return this.collectionRepository.save(collection);
    }

    async update(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        
        let collection = await this.collectionRepository.findOneBy({ id });

        if (!collection) {
            return "this collection does not exist"
        }

        //TODO

    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let recipe = await this.collectionRepository.findOneBy({ id });

        if (!recipe) {
            return "this collection does not exist"
        }

        await this.collectionRepository.remove(recipe);

        return "collection has been removed";
    }

}