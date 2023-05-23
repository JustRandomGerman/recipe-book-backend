import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from "express";
import { Recipe } from "../entity/Recipe";
import { ImagePath } from '../entity/ImagePath';
import { UploadedFile } from 'express-fileupload';
import * as Joi from 'joi';

export class RecipeController {

    private recipeRepository = AppDataSource.getRepository(Recipe);
    private baseImagePath = "http://localhost:3000/images/";
    private tempImagePath = "http://localhost:3000/temp/";
    private fs = require('fs');
    private path = require('path');

    private recipeSchema = Joi.object({
        id: Joi.number(),
        name: Joi.string().required(),
        instructions: Joi.string().required(),
        image_paths: Joi.array().items({
            path: Joi.string().required()
        }).required(),
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
        }).required(),
        collections: Joi.array()
    });

    async all(request: Request, response: Response, next: NextFunction) {
        const recipes = await this.recipeRepository.find();

        //complete the link to the image
        recipes.map((recipe: Recipe) => {
            recipe.image_paths.map((imagePath : ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);
        });

        return recipes;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if(isNaN(id)){
            response.status(400).json({message: "The ID must be a valid number"});
            return;
        }

        const recipe = await this.recipeRepository
        .createQueryBuilder('recipe')
        .leftJoinAndSelect('recipe.ingredients', 'ingredient')
        .leftJoinAndSelect('recipe.tags', 'tag')
        .leftJoinAndSelect('recipe.keywords', 'keyword')
        .leftJoinAndSelect('recipe.image_paths', 'image_path')
        .leftJoinAndSelect('recipe.collections', 'collection')
        .where('recipe.id = :id', { id })
        .getOne();


        if (!recipe) {
            response.status(404).json({message: "The recipe could not be found"});
            return;
        }

        //complete the link to the image
        recipe.image_paths.map((imagePath : ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);

        return recipe;
    }

    async upload(request: Request, response: Response, next: NextFunction){
        if (request.files && request.files.image) {
            if(Array.isArray(request.files)){
                response.status(500).json({ message: "Multiple images not supported" });
                return;
            }
            const imageFile = request.files.image;
            const imageFileName = `${(imageFile as UploadedFile).name}`;
        
            // Move the image file to the "public/temp" directory
            (imageFile as UploadedFile).mv(`public/temp/${imageFileName}`, (error) => {
                if (error) {
                    console.error(error);
                    response.status(500).json({ message: "Failed to upload image file" });
                    return;
                }

                next();
            });
            response.status(200).json({image: this.tempImagePath + imageFileName});
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
            response.status(400).json({ message: error.details });
            return;
        }

        const { name, instructions, image_paths, ingredients, tags, keywords } = request.body;

        const recipeToSave = Object.assign(new Recipe(), {
            name,
            instructions,
            image_paths,
            ingredients,
            tags,
            keywords
        });

        const recipe = await this.recipeRepository.save(recipeToSave);

        let recipe_image_paths : ImagePath[] = [];
        image_paths.map((image_path, index) => {
            if(image_path.path.startsWith(this.baseImagePath)){
                //do nothing, because image hasn't changed
            }
            else if(image_path.path.startsWith(this.tempImagePath)){
                //move the image from temp to images directory, rename it and change the image name in database
                const imageName = image_path.path.replace(this.tempImagePath, "");
                const extension = this.path.extname(imageName);
                const newImageName = `${recipe.id}-${name}-${index}${extension}`;
                this.fs.rename(`public/temp/${imageName}`, `public/images/${newImageName}`, function(err) {
                    if (err) throw err;
                });
                recipe_image_paths.push(Object.assign(new ImagePath(), {
                    path: newImageName
                }))
            }
            else{
                //The image has to be on the server before updating the image property of the recipe. That means the upload function has to be called before changing the image
                response.status(400).json({message: "No valid image URL given. You have to upload the image and use the URL from the response"});
                return;
            }
        })
        recipe.image_paths = recipe_image_paths;

        //save the recipe in the database
        const newRecipe = await this.recipeRepository.save(recipe);
        
        //complete the link to the image
        recipe.image_paths.map((imagePath : ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);

        response.status(200).json(newRecipe);
        return;
    }

    async update(request: Request, response: Response, next: NextFunction){
        const id = parseInt(request.params.id);
        if(isNaN(id)){
            response.status(400).json({message: "The ID must be a valid number"});
            return;
        }
        
        //validate parameters
        const { error } = this.recipeSchema.validate(request.body);
        if (error) {
            response.status(400).json({ message: error.details });
            return;
        }
        
        const { name, instructions, image_paths, ingredients, tags, keywords } = request.body;
        
        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            response.status(404).json({message: "The recipe could not be found"});
            return;
        }

        recipe.name = name;
        recipe.instructions = instructions;
        recipe.ingredients = ingredients;
        recipe.tags = tags;
        recipe.keywords = keywords;

        let recipe_image_paths : ImagePath[] = [];
        image_paths.map((image_path, index) => {
            if(image_path.path.startsWith(this.baseImagePath)){
                const imageName = image_path.path.replace(this.baseImagePath, "");
                recipe_image_paths.push(Object.assign(new ImagePath(), {
                    path: imageName
                }));
            }
            else if(image_path.path.startsWith(this.tempImagePath)){
                //move the image from temp to images directory, rename it and change the image name in database
                const imageName = image_path.path.replace(this.tempImagePath, "");
                const extension = this.path.extname(imageName);
                const newImageName = `${recipe.id}-${name}-${index}${extension}`;
                this.fs.rename(`public/temp/${imageName}`, `public/images/${newImageName}`, function(err) {
                    if (err) throw err;
                });
                recipe_image_paths.push(Object.assign(new ImagePath(), {
                    path: newImageName
                }));
            }
            else{
                //The image has to be on the server before updating the image property of the recipe. That means the upload function has to be called before changing the image
                response.status(400).json({message: "No valid image URL given. You have to upload the image and use the URL from the response"});
                return;
            }
        })
        recipe.image_paths = recipe_image_paths;

        //save the recipe in the database
        const newRecipe = await this.recipeRepository.save(recipe);
        
        //complete the link to the image
        recipe.image_paths.map((imagePath : ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);

        response.status(200).json(newRecipe);
        return;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if(isNaN(id)){
            response.status(400).json({message: "The ID must be a valid number"});
            return;
        }

        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            response.status(404).json({message: "The recipe could not be found"});
            return;
        }

        //delete images associated with recipe
        recipe.image_paths.map((image_path) => {
            const complete_path = `public/images/${image_path.path}`;
            this.fs.unlink(complete_path, (error) => {
                console.error(error);
            });
        })

        await this.recipeRepository.remove(recipe);
        response.status(200).json({message: "Successfully deleted recipe"});
        return;
    }
}