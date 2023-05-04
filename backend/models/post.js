import { Schema, Types, model } from 'mongoose';

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      public_id: String,
      url: String,
    },
    creator: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Post = model('Post', postSchema);
