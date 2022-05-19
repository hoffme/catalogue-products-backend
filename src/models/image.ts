import {Schema, model, Document} from "mongoose";

interface ImageJSON {
    id: string
    size: number
    type: string
    uri: string
    data?: Buffer
    createdAt: Date
}

interface ImageCreateParams {
    size: number
    type: string
    data: Buffer
}

interface ImageDocument extends Document {
    size: number
    type: string
    data: Buffer
    createdAt: Date
}

const schema = new Schema<ImageDocument>({
    size: Number,
    type: String,
    data: Buffer,
    createdAt: { type: Date, default: () => new Date() },
});

const Model = model<ImageDocument>('Image', schema);

class Image implements ImageJSON {

    public static async Find(id: string): Promise<Image | null> {
        const doc = await Model.findOne({ _id: id });
        if (!doc) return null;
        return new Image(doc);
    }

    public static async All(): Promise<Image[]> {
        const docs = await Model.find({}, { id: 1, size: 1, type: 1, createdAt: 1 })
            .sort({ createdAt: 'desc' });

        return docs.map(doc => new Image(doc));
    }

    public static async Create(params: ImageCreateParams): Promise<Image> {
        const doc = new Model({
            size: params.size,
            type: params.type,
            data: params.data
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
    public get id(): string { return this.doc._id.toHexString() };
    public get size(): number { return this.doc.size };
    public get type(): string { return this.doc.type };
    public get uri(): string { return `/api/images/${this.id}` }
    public get data(): Buffer | undefined { return this.doc.data };

}

export default Image;
export type {
    ImageJSON,
    ImageCreateParams
}