import multer, { memoryStorage } from "multer";
import { Router, Response, Request } from 'express';

import ImageController from "../../controllers/image";

import wrpHandler from "./utils/handler";

const uploads = multer({
    storage: memoryStorage()
});

const imageRouter = Router();

imageRouter.get('/:id?', (req: Request, res: Response) => {
    ImageController.Get(req, res);
})

imageRouter.post('/', uploads.single('image'), wrpHandler(req => {
    return ImageController.Create(req);
}))

imageRouter.delete('/:id', wrpHandler(req => ImageController.Delete(req)))

export default imageRouter;