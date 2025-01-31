import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPreference extends Document {
    _id: string
    name: string;
    value: string;
}

const preferenceSchema: Schema = new Schema({

    name: {
        type: String,
        required: true,
        enum: ['drinking', 'smoking'],
    },
    value: { type: String, required: true },

}, { timestamps: true });

export default mongoose.model<IPreference>("Preference", preferenceSchema);
