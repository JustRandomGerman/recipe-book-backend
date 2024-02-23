import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from "express";
import { Recipe } from "../entity/Recipe";
import * as jszip from 'jszip';
import mysqldump from 'mysqldump';
import * as fs from 'fs';

export class DeveloperController{

    async export(request: Request, response: Response, next: NextFunction) {

        await mysqldump({
            connection: {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                database: process.env.DB_DATABASE,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            },
            dumpToFile: 'dbdump/dump.sql'
        });

        const filename = 'export.zip';
        
        const zip = new jszip();
        zip.file('dump.sql', fs.readFileSync('dbdump/dump.sql'));
        zip.folder('images');
        fs.readdirSync('public/images').forEach(file => {
            if(file !== '.gitignore'){
                zip.file(`images/${file}`, fs.readFileSync(`public/images/${file}`));
            } 
        });

        const zippedFile = await zip.generateAsync({type: "uint8array"}); 
        response.set('Content-Type', 'application/zip');
        response.set('Content-Disposition', `attachement; filename=${filename}`);
        response.set('Content-Length', `${zippedFile.length}`);
        response.end(zippedFile, 'binary');
        return;
    }

    async import(request: Request, response: Response, next: NextFunction){
        
        response.status(200);
        return;
    }
}
