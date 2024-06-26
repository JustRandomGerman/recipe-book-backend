import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from "express";
import { Recipe } from "../entity/Recipe";
import { ImagePath } from '../entity/ImagePath';
import { UploadedFile } from 'express-fileupload';
import * as Joi from 'joi';
import * as fs from 'fs';
import * as path from 'path';

export class RecipeController {

    private recipeRepository = AppDataSource.getRepository(Recipe);
    private baseImagePath = `${process.env.BASE_URL}:${process.env.PORT}/images/`;
    private tempImagePath = `${process.env.BASE_URL}:${process.env.PORT}/temp/`;

    private recipeSchema = Joi.object({
        id: Joi.number(),
        name: Joi.string().required(),
        instructions: Joi.string().required(),
        image_paths: Joi.array().items({
            path: Joi.string().required()
        }).required(),
        ingredient_groups: Joi.array().items({
            id: Joi.string(),
            name: Joi.string().required(),
            position: Joi.number(),
            ingredients: Joi.array().items({
                id: Joi.string(),
                amount: Joi.string().allow('').required(),
                ingredient_name: Joi.string().required(),
                position: Joi.number().required()
            })
        }).required(),
        tags: Joi.array().items({
            id: Joi.string(),
            tag_name: Joi.string().required()
        }).required(),
        keywords: Joi.array().items({
            id: Joi.string(),
            keyword_name: Joi.string().required()
        }).required(),
        collections: Joi.array(),
        last_viewed: Joi.date()
    });

    async all(request: Request, response: Response, next: NextFunction) {
        const recipes = await this.recipeRepository.find();

        //complete the link to the image
        recipes.map((recipe: Recipe) => {
            recipe.image_paths.map((imagePath: ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);
        });

        return recipes;
    }

    async recent(request: Request, response: Response, next: NextFunction) {
        const amount = request.query.amount;

        //if amount is undefined, an array or anything else just use the default value of 20
        const amountValue = typeof amount !== 'string' ? 20 : parseInt(amount, 10);

        //get last viewed recipes, if amountValue is NaN use default of 20
        const recipes = await this.recipeRepository.find({order: {last_viewed: "DESC"}, take: (isNaN(amountValue) ? 20 : amountValue)});

        //complete the link to the image
        recipes.map((recipe: Recipe) => {
            recipe.image_paths.map((imagePath: ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);
        });

        return recipes;
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        if(isNaN(id)){
            response.status(400).json({message: "The ID must be a valid number"});
            return;
        }

        const recipe = await this.recipeRepository.findOne({
            where: { id }
        });

        if (!recipe) {
            response.status(404).json({message: "The recipe could not be found"});
            return;
        }

        //set the viewed date to current time and save
        recipe.last_viewed = new Date(Date.now());
        const newRecipe = await this.recipeRepository.save(recipe);

        //complete the link to the image
        newRecipe.image_paths.map((imagePath: ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);


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

        const { name, instructions, image_paths, ingredient_groups, tags, keywords } = request.body;

        //save the new recipe, primarily for getting the ID (images are just empty array because they first get renamed, then saved)
        const recipeToSave = Object.assign(new Recipe(), {
            name,
            instructions,
            image_paths: [],
            ingredient_groups,
            tags,
            keywords
        });

        const recipe = await this.recipeRepository.save(recipeToSave);

        let recipe_image_paths: ImagePath[] = [];
        image_paths.map((image_path, index) => {
            if(image_path.path.startsWith(this.baseImagePath)){
                //do nothing, because image hasn't changed
            }
            else if(image_path.path.startsWith(this.tempImagePath)){
                //move the image from temp to images directory, rename it and change the image name in database
                const imageName = image_path.path.replace(this.tempImagePath, "");
                const extension = path.extname(imageName);
                const newImageName = `${recipe.id}-${name}-${index}${extension}`;
                fs.rename(`public/temp/${imageName}`, `public/images/${newImageName}`, function(err) {
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
        recipe.image_paths.map((imagePath: ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);

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
        
        const { name, instructions, image_paths, ingredient_groups, tags, keywords } = request.body;
        
        let recipe = await this.recipeRepository.findOneBy({ id });

        if (!recipe) {
            response.status(404).json({message: "The recipe could not be found"});
            return;
        }

        recipe.name = name;
        recipe.instructions = instructions;
        recipe.ingredient_groups = ingredient_groups;
        recipe.tags = tags;
        recipe.keywords = keywords;

        let recipe_image_paths: ImagePath[] = [];
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
                const extension = path.extname(imageName);
                const newImageName = `${recipe.id}-${name}-${index}${extension}`;
                fs.rename(`public/temp/${imageName}`, `public/images/${newImageName}`, function(err) {
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
        recipe.image_paths.map((imagePath: ImagePath) => imagePath.path = this.baseImagePath + imagePath.path);

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
            fs.unlink(complete_path, (error) => {
                console.error(error);
            });
        })

        await this.recipeRepository.remove(recipe);
        response.status(200).json({message: "Successfully deleted recipe"});
        return;
    }
}