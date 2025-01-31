import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegisterOtp extends Document {
    _id: string
    type: string
    email: string
    phoneNumber: string
    otp: number
}

const registerOtpSchema: Schema = new Schema({
    type: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String },
    otp: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IRegisterOtp>("RegisterOtp", registerOtpSchema);
