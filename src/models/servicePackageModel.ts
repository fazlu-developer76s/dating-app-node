import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServicePackage extends Document {
    _id: string
    name: string
    price: number
    available: boolean
    description: string
    duration: string
    features: [string]
}

const servicePackageSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    description: { type: String },
    duration: { type: String },
    features: { type: [String], required: true }
}, { timestamps: true });

export default mongoose.model<IServicePackage>("ServicePackage", servicePackageSchema);
