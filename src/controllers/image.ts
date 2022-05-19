import { readFile } from "fs/promises";
import {Request, Response} from "express";

import Image from "../models/image";

import {HandlerResult} from "../api/rest/utils/handler";
import {errorResponse, jsonResponse} from "../api/rest/utils/response";

class ImageController {

    private static _path: string = 'images'

    public static setPath(images_path: string) { this._path = images_path }

    public static get path() { return this._path }

    public static Get(req: Request, res: Response) {
        const id = req.params.id;
        if (!id || id.length === 0) {
            Image.All()
                .then(images => { jsonResponse(res, 200, images.map(img => img.json())) })
                .catch(err => { errorResponse(res, 500, err) })

            return;
        }

        let image: Image;
        Image.Find(id)
            .then(data => {
                if (!data) throw new Error('not found');
                image = data;
                return readFile(`${ImageController.path}/${id}`);
            })
            .then(buffer => {
                res.writeHead(200, { 'Content-Type': image.type });
                res.end(buffer);
            })
            .catch(() => {
                errorResponse(res, 404, new Error('not found'));
            })
    }

    public static async Create(req: Request): Promise<HandlerResult> {
        if (!req.file) throw new Error('internal error');

        const image = await Image.Create({
            id: req.file.filename,
            size: req.file.size,
            type: req.file.mimetype
        });

        return {
            data: image.json()
        };
    }

    public static async Delete(req: Request): Promise<HandlerResult> {
        const id = req.params.id;

        const image = await Image.Find(id);
        if (!image) return {
            code: 404,
            error: new Error('image not found')
        }

        await image.delete();

        return {
            data: true
        };
    }
}

export default ImageController;