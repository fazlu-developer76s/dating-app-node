import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  roomId: string;
  message: {
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    message: string;
    type: string; // 'text', 'audio', 'image', etc.
    view: string; // '0': unviewed, '1': viewed
  }[];
}

const messageSchema = new Schema<IMessage>({
  roomId: { type: String, ref: 'Chat' },
  message: [
    {
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
      message: { type: String },
      type: { type: String, default: '' },
      createAt: { type: Date, default: Date.now },
      view: { type: String, default: '0' }, // '0': unviewed, '1': viewed
    },
  ],
},{ timestamps: true });

export default mongoose.model<IMessage>('Message', messageSchema);
