import {Schema, model, Document} from "mongoose";

interface ProductJSON {
    id: string
    name: string
    description: string
    image: string
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date
}

interface ProductFilter {
    id?: string[]
    query?: string
    priceMin?: number
    priceMax?: number
    stockMin?: number
    stockMax?: number
    orderBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt'
    orderAsc?: boolean
    limit?: number
    offset?: number
}

interface ProductCreateParams {
    name: string
    description: string
    image: string
    price: number
    stock: number
}

interface ProductUpdateParams {
    name?: string
    description?: string
    image?: string
    price?: number
    stock?: number
}

interface ProductDocument extends Document {
    name: string
    description: string
    image: string
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date
}

const schema = new Schema<ProductDocument>({
    name: String,
    description: String,
    image: String,
    price: Number,
    stock: Number,
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
});

const Model = model<ProductDocument>('Product', schema);

class Product {

    public static async FindById(id: string): Promise<Product | null> {
        const doc = await Model.findOne({ _id: id });
        if (!doc) return null;

        return new Product(doc);
    }

    public static async Search(params: ProductFilter): Promise<Product[]> {
        const offset = params.offset || 0;
        const limit = params.limit || 20;
        const sort = { [params.orderBy || 'name']: params.orderAsc === true ? 'asc' : 'desc' };
        const filter: any = {}

        if (params.id) filter._id = { $in: params.id };

        if (params.query) filter.name = { $regex: params.query };

        if (params.priceMin || params.priceMax) filter.price = {};
        if (params.priceMin) filter.price.$gte = params.priceMin;
        if (params.priceMax) filter.price.$lt = params.priceMax;

        if (params.stockMin || params.stockMax) filter.stock = {};
        if (params.stockMin) filter.stock.$gte = params.stockMin;
        if (params.stockMax) filter.stock.$lt = params.stockMax;

        const docs = await Model.find(filter)
            .sort(sort)
            .limit(limit)
            .skip(offset);

        return docs.map(doc => new Product(doc));
    }

    public static async Create(params: ProductCreateParams): Promise<Product> {
        const doc = new Model(params);
        await doc.save();

        return new Product(doc);
    }

    private readonly doc: ProductDocument;

    private constructor(doc: ProductDocument) { this.doc = doc }

    public async update(params: ProductUpdateParams): Promise<void> {
        this.doc.updatedAt = new Date();

        if (params.name !== undefined) this.doc.name = params.name;
        if (params.description !== undefined) this.doc.description = params.description;
        if (params.image !== undefined) this.doc.image = params.image;
        if (params.price !== undefined) this.doc.price = params.price;
        if (params.stock !== undefined) this.doc.stock = params.stock;

        await this.doc.save();
    }

    public async delete(): Promise<void> {
        await this.doc.delete();
    }

    public json(): ProductJSON {
        return {
            id: this.doc._id.toHexString(),
            name: this.doc.name,
            description: this.doc.description,
            image: this.doc.image,
            price: this.doc.price,
            stock: this.doc.stock,
            createdAt: this.doc.createdAt,
            updatedAt: this.doc.updatedAt
        }
    }

}

export default Product;
export type {
    ProductJSON,
    ProductFilter,
    ProductCreateParams,
    ProductUpdateParams
}