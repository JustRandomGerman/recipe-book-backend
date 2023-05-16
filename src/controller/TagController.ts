import { NextFunction, Request, Response } from "express"

export class TagController {

    async available(request: Request, response: Response, next: NextFunction) {
        let availableTags = [
            {tag_name: "breakfast"},
            {tag_name: "lunch"},
            {tag_name: "dinner"},
            {tag_name: "snack"},
            {tag_name: "vegan"},
            {tag_name: "vegetarian"},
            {tag_name: "lactose free"},
            {tag_name: "gluten free"},
            {tag_name: "italian"},
            {tag_name: "german"}
        ]
        response.status(200).json(availableTags);
        return;
    }

}