import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILanguage extends Document {
    _id: string
    name: string
    image: string
    available: boolean
}

const languageSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ILanguage>("Language", languageSchema);
