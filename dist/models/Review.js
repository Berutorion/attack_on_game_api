"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const TIME_FORMATTER_1 = __importDefault(require("@/const/TIME_FORMATTER"));
const { Schema } = mongoose_1.default;
// 定義 ContentObject 的 Schema
const ContentObjectSchema = new Schema({
    rate: { type: Number, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderNo: { type: String, required: true },
    // eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    content: { type: String, required: true },
    createTime: { type: Date, default: (0, dayjs_1.default)().format(TIME_FORMATTER_1.default) },
});
// 定義 ReviewObject 的 Schema，並將 ContentObjectSchema 嵌入其中
const ReviewObjectSchema = new Schema({
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    idNumber: { type: String, default: '' },
    rate: { type: Number, required: true },
    content: [ContentObjectSchema], // 嵌入 ContentObjectSchema
    createdAt: { type: String, default: (0, dayjs_1.default)().format(TIME_FORMATTER_1.default) },
    updatedAt: { type: String, default: (0, dayjs_1.default)().format(TIME_FORMATTER_1.default) },
});
// 創建模型
const ReviewModel = mongoose_1.default.model('ReviewObject', ReviewObjectSchema);
exports.ReviewModel = ReviewModel;
//updateTime
ReviewObjectSchema.pre('save', function (next) {
    this.set('updatedAt', (0, dayjs_1.default)().format(TIME_FORMATTER_1.default));
    next();
});
//# sourceMappingURL=Review.js.map