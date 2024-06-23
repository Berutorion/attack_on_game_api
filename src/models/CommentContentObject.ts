import { Schema, Document, model } from 'mongoose';

export interface ICommentContentObject extends Document {
  author: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  content: String;
  createAt: Date;
}

const commentContentObjectSchema: Schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'events',
    required: true,
  },
  content: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
});

export const commentContentObject = model<ICommentContentObject>(
  'CommentContentObject',
  commentContentObjectSchema,
  'commentContentObject',
);
