import { NextFunction, Request, Response } from "express"
import { AvailableTag } from "../entity/AvailableTag";
import { AppDataSource } from "../data-source";
import * as Joi from 'joi'; 

export class TagController {

    private tagRepository = AppDataSource.getRepository(AvailableTag);

    private tagSchema = Joi.object({
        id: Joi.string(),
        tag_name: Joi.string().required()
    });

    async available(request: Request, response: Response, next: NextFunction) {
        const newTags = await this.tagRepository.find();
        response.status(200).json(newTags);
        return;
    }

    async new(request: Request, response: Response, next: NextFunction) {
        //validate parameters
        const { error } = this.tagSchema.validate(request.body);
        if (error) {
            response.status(400).json({ message: error.details });
            return;
        }
        
        const { tag_name } = request.body;

        // Check if tag_name is unique
        const existingTag = await this.tagRepository.findOne({ where: { tag_name } });
        if (existingTag) {
            response.status(400).json({ message: "Tag name already exists" });
            return;
        }

        const tagToSave = Object.assign(new AvailableTag(), {
            tag_name
        });

        const tag = await this.tagRepository.save(tagToSave);
        
        response.status(201).json(tag);
        return;
    }

}