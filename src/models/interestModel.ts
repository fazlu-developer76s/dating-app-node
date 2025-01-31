import mongoose, { Schema, Document, Model } from "mongoose";
// ex  fun casual dates,marriage etc

export interface IInterest extends Document {
    _id: string
    name: string
    image: string
    available: boolean
}

const interestSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IInterest>("Interest", interestSchema);
