import {Router} from "express";

import productRouter from "./product";

const apiRouter = Router();

apiRouter.use('/products', productRouter);

export default apiRouter;