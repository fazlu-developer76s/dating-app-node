import mongoose, { Schema, Document } from 'mongoose';

interface IFollowing extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  followingUserId: mongoose.Schema.Types.ObjectId
}

const followingSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followingUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IFollowing>('Following', followingSchema);

