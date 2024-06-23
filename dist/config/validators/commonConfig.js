"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPastDate = exports.isFutureDate = exports.isValidDateFormat = exports.isValidNanoid = exports.isValidObjectId = void 0;
const mongoose_1 = require("mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const isValidObjectId = (value) => {
    return mongoose_1.Types.ObjectId.isValid(value);
};
exports.isValidObjectId = isValidObjectId;
const isValidNanoid = (value) => {
    const nanoidRegex = /^[a-z0-9]{8}$/;
    if (!nanoidRegex.test(value)) {
        throw new Error('Invalid ID format');
    }
    return true;
};
exports.isValidNanoid = isValidNanoid;
const isValidDateFormat = (value, { path }) => {
    if (!(0, dayjs_1.default)(value).isValid()) {
        throw new Error(`${path}時間格式不對哦！必須是有效日期`);
    }
    return true;
};
exports.isValidDateFormat = isValidDateFormat;
const isFutureDate = (value, { path }) => {
    const now = (0, dayjs_1.default)();
    if ((0, dayjs_1.default)(value).isAfter(now)) {
        return true;
    }
    throw new Error(`${path}時間格式不對哦！必須是未來的日期`);
};
exports.isFutureDate = isFutureDate;
const isPastDate = (value, { path }) => {
    const now = (0, dayjs_1.default)();
    if ((0, dayjs_1.default)(value).isBefore(now)) {
        return true;
    }
    throw new Error(`${path}時間格式不對哦！必須是今天以前的日期`);
};
exports.isPastDate = isPastDate;
//# sourceMappingURL=commonConfig.js.map