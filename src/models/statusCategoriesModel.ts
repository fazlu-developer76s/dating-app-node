import mongoose, { Schema, Document, Model } from "mongoose";

// like sigle,married,divorced
export interface IStatusCategories extends Document {
    _id: string
    name: string
    image: string
    available: boolean
}

const statusCategoriesSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IStatusCategories>("StatusCategories", statusCategoriesSchema);
