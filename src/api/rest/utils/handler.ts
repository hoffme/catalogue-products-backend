import {NextFunction, Request, Response} from "express";

import {errorResponse, jsonResponse} from "./response";

interface HandlerResult {
    code?: number
    data?: any
    error?: any
}

type CustomHandler = (req: Request) => Promise<HandlerResult>

const wrpHandler = (handler: CustomHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        handler(req)
            .then(result => {
                if (result.error) {
                    errorResponse(res, result.code || 500, result.error);
                } else if (result.data) {
                    jsonResponse(res, result.code || 200, result.data);
                }

                next();
            })
            .catch(err => next(err))
    }
}

export default wrpHandler;
export type {
    CustomHandler,
    HandlerResult
}