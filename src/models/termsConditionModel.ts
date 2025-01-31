import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITermsCondition extends Document {
    _id: string
    description: string
    status: boolean
}

const termsConditionSchema: Schema = new Schema({

    description: { type: String, required: true },
    status: { type: Boolean, required: true },

}, { timestamps: true });

export default mongoose.model<ITermsCondition>("TermsCondition", termsConditionSchema);
