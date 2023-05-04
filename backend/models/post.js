import { Schema, Types, model } from 'mongoose';

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: true,
      },
    },
    creator: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Post = model('Post', postSchema);
