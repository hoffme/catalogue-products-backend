import { Router } from 'express';

import ProductController from "../../controllers/product";

import wrpHandler from "./utils/handler";

const productRouter = Router();

productRouter.get('/:id', wrpHandler(r => ProductController.Find(r)))

productRouter.post('/search', wrpHandler(r => ProductController.Search(r)))

productRouter.post('/', wrpHandler(r => ProductController.Create(r)))

productRouter.put('/:id', wrpHandler(r => ProductController.Update(r)))

productRouter.delete('/:id', wrpHandler(r => ProductController.Delete(r)))

export default productRouter;