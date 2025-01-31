import mongoose, { Schema, Document, Model } from "mongoose";
// ex  fun casual dates,marriage etc

export interface ILookingFor extends Document {
    _id: string
    name: string
    image: string
    available: boolean
}

const lookingForSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ILookingFor>("LookingFor", lookingForSchema);
