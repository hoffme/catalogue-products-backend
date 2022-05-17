import { Router } from 'express';

import ProductController from "../../controllers/product";

import wrpHandler from "./utils/handler";

const productRouter = Router();

productRouter.get('/:id', wrpHandler(ProductController.Find))

productRouter.post('/search', wrpHandler(ProductController.Search))

productRouter.post('/', wrpHandler(ProductController.Create))

productRouter.put('/:id', wrpHandler(ProductController.Update))

productRouter.delete('/:id', wrpHandler(ProductController.Delete))

export default productRouter;