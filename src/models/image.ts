import {Schema, model, Document} from "mongoose";

interface ImageJSON {
    id: string
    size: number
    type: string
    uri: string
    createdAt: Date
}

interface ImageCreateParams {
    id: string
    size: number
    type: string
}

interface ImageDocument extends Document {
    id: string
    size: number
    type: string
    createdAt: Date
}

const schema = new Schema<ImageDocument>({
    id: String,
    size: Number,
    type: String,
    createdAt: { type: Date, default: () => new Date() },
});

const Model = model<ImageDocument>('Image', schema);

class Image implements ImageJSON {

    public static async Find(id: string): Promise<Image | null> {
        const doc = await Model.findOne({ id: id });
        if (!doc) return null;

        return new Image(doc);
    }

    public static async All(): Promise<Image[]> {
        const docs = await Model.find()
            .sort({ createdAt: 'desc' });

        return docs.map(doc => new Image(doc));
    }

    public static async Create(params: ImageCreateParams): Promise<Image> {
        const doc = new Model({
            id: params.id,
            size: params.size,
            type: params.type
        });
        await doc.save();

        return new Image(doc);
    }

    private readonly doc: ImageDocument;

    private constructor(doc: ImageDocument) { this.doc = doc }

    public async delete(): Promise<void> {
        await this.doc.delete();
    }

    public json(): ImageJSON {
        return {
            id: this.id,
            size: this.size,
            type: this.type,
            uri: this.uri,
            createdAt: this.createdAt
        }
    }

    public get createdAt(): Date { return this.doc.createdAt };
    public get id(): string { return this.doc.id };
    public get size(): number { return this.doc.size };
    public get type(): string { return this.doc.type };
    public get uri(): string { return `/api/images/${this.id}` }

}

export default Image;
export type {
    ImageJSON,
    ImageCreateParams
}