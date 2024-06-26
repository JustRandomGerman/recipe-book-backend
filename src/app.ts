import * as express from "express"
import * as bodyParser from "body-parser"
import * as fileUpload from "express-fileupload"
import * as cors from "cors"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()
    app.use(cors({
        origin: "*",
        credentials: true
    }))
    app.use(bodyParser.json())
    app.use(fileUpload())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.path, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    app.use(express.static("public"))

    // setup express app here
    // ...

    // start express server
    app.listen(process.env.PORT)

    console.log(`Express server has started on port ${process.env.PORT}. Open ${process.env.BASE_URL}:${process.env.PORT}/recipes to see results`)

}).catch(error => console.log(error))
