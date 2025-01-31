import { required } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

interface IFaq extends Document {
  question: string;
  answer: string;
  status: boolean;
}

const faqSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFaq>('Faq', faqSchema);

