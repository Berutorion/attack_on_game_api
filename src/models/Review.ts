import { ReviewDocument } from '@/interfaces/Review';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import TIME_FORMATTER from '@/const/TIME_FORMATTER';
const { Schema } = mongoose;

// 定義 ContentObject 的 Schema
const ContentObjectSchema = new Schema({
  rate: { type: Number, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderNo: { type: String, required: true },
  // eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  content: { type: String, required: true },
  createTime: { type: Date, default: dayjs().format(TIME_FORMATTER) },
});

// 定義 ReviewObject 的 Schema，並將 ContentObjectSchema 嵌入其中
const ReviewObjectSchema = new Schema({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  idNumber: { type: String, default: '' },
  rate: { type: Number, required: true },
  content: [ContentObjectSchema], // 嵌入 ContentObjectSchema
  createdAt: { type: String, default: dayjs().format(TIME_FORMATTER) },
  updatedAt: { type: String, default: dayjs().format(TIME_FORMATTER) },
});

// 創建模型
const ReviewModel = mongoose.model<ReviewDocument>(
  'ReviewObject',
  ReviewObjectSchema,
);

//updateTime
ReviewObjectSchema.pre('save', function (next) {
  this.set('updatedAt', dayjs().format(TIME_FORMATTER));
  next();
});

export { ReviewModel };
