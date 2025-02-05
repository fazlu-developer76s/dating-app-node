import mongoose, { Schema, Document, Types } from 'mongoose';

interface IMessageObject {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  type: string; // e.g., 'text', 'audio', 'image'
  view: string; // '0': unviewed, '1': viewed
  createdAt?: Date;
}

export interface IMessage extends Document {
  roomId: string;
  message: IMessageObject[];
}

const messageSchema = new Schema<IMessage>(
  {
    roomId: { type: String, ref: 'Chat', required: true },
    message: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: false },
        type: { type: String, default: 'text' },
        view: { type: String, default: '0' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', messageSchema);
