import mongoose, { Schema, Document } from 'mongoose';

interface IPriviterm extends Document {
  description: string
  status: boolean
  title: string
}

const privitermSchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    status: { type: Boolean, required: true },
    title: { type: String, enum: ['terms condition', 'privacy policy'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPriviterm>('Priviterm', privitermSchema);

