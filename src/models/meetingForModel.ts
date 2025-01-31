import mongoose, { Schema, Document, Model } from "mongoose";

// ex male,female
export interface IMeetingFor extends Document {
    _id: string
    name: string
    image: string
    available: boolean
}

const meetingForSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IMeetingFor>("MeetingFor", meetingForSchema);
