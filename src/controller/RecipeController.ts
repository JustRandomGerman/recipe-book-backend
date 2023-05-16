import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Recipe } from "../entity/Recipe"
import { UploadedFile } from 'express-fileupload'
import * as Joi from 'joi';

export class RecipeController {

    private recipeRepository = AppDataSource.getRepository(Recipe)
    private baseImagePath = "http://localhost:3000/images/"
    private tempImagePath = "http://localhost:3000/temp/"
    private fs = require('fs')
    private path = require('path')

    private recipeSchema = Joi.object({
        id: Joi.number(),
        name: Joi.string().required(),
        instructions: Joi.string().required(),
        image: Joi.string().required(),
        ingredients: Joi.array().items({
            id: Joi.number(),
            amount: Joi.string().allow('').required(),
            ingredient_name: Joi.string().required()
        }).required(),
        tags: Joi.array().items({
            id: Joi.number(),
            tag_name: Joi.string().required()
        }).required(),
        keywords: Joi.array().items({
            id: Joi.number(),
            keyword_name: Joi.string().required()
        }).required()
    });

    async all(request: Request, response: Response, next: NextFunction) {
        const recipes = await this.recipeRepository.find();

        //complete the link to the image
        recipes.map((recipe: Recipe) => recipe.image = this.baseImagePath + recipe.image)

        return recipes;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if(isNaN(id)){
            response.status(400).json({message: "the id must be a number"})
            return
        }

        const recipe = await this.recipeRepository.findOne({
            where: { id }
        });

        if (!recipe) {
            response.status(404).json({message: "the specified recipe does not exist"})
            return
        }

        //complete the link to the image
        recipe.image = this.baseImagePath + recipe.image;

        return recipe;
    }

    async upload(request: Request, response: Response, next: NextFunction){
        if (request.files && request.files.image) {
            if(Array.isArray(request.files)){
                response.status(500).json({ message: "multiple images not supported" })
                return
            }
            const imageFile = request.files.image;
            const imageFileName = `${(imageFile as UploadedFile).name}`;
        
            // Move the image file to the "public/temp" directory
            (imageFile as UploadedFile).mv(`public/temp/${imageFileName}`, (error) => {
                if (error) {
                    console.error(error);
                    response.status(500).json({ message: "failed to upload image file" });
                    return;
                }

                next()
            });
            response.status(200).json({image: this.tempImagePath + imageFileName})
            return;
        }
        else{
            response.status(400).json({message: "No image provided"});
            return;
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        //validate parameters
        const { error } = this.recipeSchema.validate(request.body);
        if (error) {
            response.status(400).json({ message: error });
            return;
        }

        const { name, instructions, image, ingredients, tags, keywords } = request.body;

        const recipeToSave = Object.assign(new Recipe(), {
            name,
            instructions,
            image,
            ingredients,
            tags,
            keywords
        });

        const recipe = await this.recipeRepository.save(recipeToSave);

        if(image.startsWith(this.baseImagePath)){
            //do nothing, because image hasn't changed
        }
        else if(image.startsWith(this.tempImagePath)){
            //move the image from temp to images directory, rename it and change the image name in database
            const imageName = image.replace(this.tempImagePath, "")
            const extension = this.path.extname(imageName)
            const newImageName = `${recipe.id}-${name}${extension}`;
            this.fs.rename(`public/temp/${imageName}`, `public/images/${newImageName}`, function(err) {
                if (err) throw err;
            });
            recipe.image = newImageName;
        }
        else{
            //The image has to be on the server before updating the image property of the recipe. That means the upload function has to be called before changing the image
            response.status(400).json({message: "no valid image URL given. You have to upload the image and use the URL from the response"})
            return
        }

        return await this.recipeRepository.save(recipe);
    }

    async update(request: Request, response: Response, next: NextFunction){
        //validate parameters
        const { error } = this.recipeSchema.validate(request.body);
        if (error) {
            response.status(400).json({ message: error });
            return;
        }
        
        const id = parseInt(request.params.id);
        const { name, instructions, image, ingredients, tags, keywords } = request.body;

        if(isNaN(id)){
            response.status(400).json({message: "the id must be a number"})
            return
        }
        
        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            response.status(404).json({message: "the specified recipe does not exist"})
            return
        }

        recipe.name = name;
        recipe.instructions = instructions;
        recipe.ingredients = ingredients;
        recipe.tags = tags;
        recipe.keywords = keywords;

        if(image.startsWith(this.baseImagePath)){
            //do nothing, because image hasn't changed
        }
        else if(image.startsWith(this.tempImagePath)){
            //move the image from temp to images directory, rename it and change the image name in database
            const imageName = image.replace(this.tempImagePath, "")
            const extension = this.path.extname(imageName)
            const newImageName = `${id}-${name}${extension}`;
            this.fs.rename(`public/temp/${imageName}`, `public/images/${newImageName}`, function(err) {
                if (err) throw err;
            });
            recipe.image = newImageName;
        }
        else{
            //The image has to be on the server before updating the image property of the recipe. That means the upload function has to be called before changing the image
            response.status(400).json({message: "no valid image URL given. You have to upload the image and use the URL from the response"})
            return
        }

        return this.recipeRepository.save(recipe)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if(isNaN(id)){
            response.status(400).json({message: "the id must be a number"})
            return
        }

        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            response.status(404).json({message: "the specified recipe does not exist"})
            return
        }

        return await this.recipeRepository.remove(recipe);
    }
}