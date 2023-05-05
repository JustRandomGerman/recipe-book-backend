import { NextFunction, Request, Response } from "express"

export class TagController {

    async available(request: Request, response: Response, next: NextFunction) {
        let availableTags = [
            {tag_name: "breakfast"},
            {tag_name: "lunch"},
            {tag_name: "dinner"},
            {tag_name: "snack"}
        ]
        response.status(200).json(availableTags)
        return
    }

}