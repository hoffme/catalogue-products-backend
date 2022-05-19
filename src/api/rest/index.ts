import {Router} from "express";

import productRouter from "./product";
import imageRouter from "./image";

const apiRouter = Router();

apiRouter.use('/products', productRouter);
apiRouter.use('/images', imageRouter);

export default apiRouter;