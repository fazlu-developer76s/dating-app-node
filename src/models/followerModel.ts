import mongoose, { Schema, Document } from 'mongoose';

interface IFollower extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  followedUserId: mongoose.Schema.Types.ObjectId
}

const followerSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IFollower>('Follower', followerSchema);

