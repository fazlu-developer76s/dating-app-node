import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISexualOrientation extends Document {
    _id: string
    name: string
    image: string
    available: boolean
}

const sexualOrientationSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ISexualOrientation>("SexualOrientation", sexualOrientationSchema);
