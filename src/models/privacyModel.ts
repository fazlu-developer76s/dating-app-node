import mongoose, { Schema, Document } from 'mongoose';

interface IPrivacy extends Document {
  description: string
  status: boolean
}


const privacySchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPrivacy>('Privacy', privacySchema);

