import { Router, Response, Request } from 'express';
import multer from "multer";
import { v4 as uuidV4 } from 'uuid';

import ImageController from "../../controllers/image";

import wrpHandler from "./utils/handler";

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, ImageController.path) },
    filename: (req, file, cb) => { cb(null, uuidV4()) }
})
const uploads = multer({ storage });

const imageRouter = Router();

imageRouter.get('/:id?', (req: Request, res: Response) => {
    ImageController.Get(req, res);
})

imageRouter.post('/', uploads.single('image'), wrpHandler(req => {
    return ImageController.Create(req);
}))

imageRouter.delete('/:id', wrpHandler(req => ImageController.Delete(req)))

export default imageRouter;