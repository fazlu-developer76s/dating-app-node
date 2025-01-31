import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  roomId: string;
  callStatus: 'ongoing' | 'ended';
  callType: 'video' | 'audio' | 'text';
}

const ChatSchema: Schema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: String, required: true },
    callStatus: { type: String, enum: ['ongoing', 'ended'], default: 'ongoing' },
    callType: { type: String, enum: ['video', 'audio', 'text'], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>('Chat', ChatSchema);
