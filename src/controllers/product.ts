import { Request } from "express";

import {HandlerResult} from "../api/rest/utils/handler";

import Product from "../models/product";

import Event from "./events";

class ProductController {

    private static readonly events = {
        create: new Event<Product>(),
        update: new Event<Product>(),
        delete: new Event<Product>()
    }
    public static readonly on = {
        create: this.events.create.client,
        update: this.events.update.client,
        delete: this.events.delete.client,
    }

    public static async Find(req: Request): Promise<HandlerResult> {
        const id = req.params.id;

        const product = await Product.FindById(id);

        return {
            data: product?.json()
        };
    }

    public static async Search(req: Request): Promise<HandlerResult> {
        const filter = req.body;

        const products = await Product.Search(filter);

        return {
            data: products.map(p => p.json())
        };
    }

    public static async Create(req: Request): Promise<HandlerResult> {
        const params = req.body;

        const product = await Product.Create(params);

        this.events.create.notify(product);

        return {
            data: product.json()
        };
    }

    public static async Update(req: Request): Promise<HandlerResult> {
        const id = req.params.id;
        const params = req.body;

        const product = await Product.FindById(id);
        if (!product) return {
            code: 404,
            error: new Error('product not found')
        }

        await product.update(params);

        this.events.update.notify(product);

        return {
            data: product.json()
        };
    }

    public static async Delete(req: Request): Promise<HandlerResult> {
        const id = req.params.id;

        const product = await Product.FindById(id);
        if (!product) return {
            code: 404,
            error: new Error('product not found')
        }

        await product.delete();

        this.events.delete.notify(product);

        return {
            data: true
        };
    }

}

export default ProductController;