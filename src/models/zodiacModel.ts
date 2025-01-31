import mongoose, { Schema, Document, Model } from "mongoose";
export interface IZodiac extends Document {
    _id: string
    name: string
    image: string
    zodiac: number
}

const zodiacSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    zodiac: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IZodiac>("Zodiac", zodiacSchema);
