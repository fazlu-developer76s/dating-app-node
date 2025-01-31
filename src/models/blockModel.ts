import mongoose, { Schema, Document } from 'mongoose';

interface IBlock extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  reciverUserId: mongoose.Schema.Types.ObjectId;
  status: string
}

const blockSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reciverUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['match', 'block', 'unblock'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBlock>('Block', blockSchema);

