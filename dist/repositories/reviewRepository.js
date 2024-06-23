"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const Review_1 = require("@/models/Review");
const lodash_1 = __importDefault(require("lodash"));
const CustomError_1 = require("@/errors/CustomError");
const CustomResponseType_1 = require("@/enums/CustomResponseType");
const OtherResponseType_1 = require("@/types/OtherResponseType");
const OrderModel_1 = __importDefault(require("@/models/OrderModel"));
const EventModel_1 = __importDefault(require("@/models/EventModel"));
class ReviewRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    findAll(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield Review_1.ReviewModel.find(queryParams);
                if (lodash_1.default.isEmpty(reviews)) {
                    throw new Error('No reviews found');
                }
                return reviews;
            }
            catch (error) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.DATABASE_OPERATION_FAILED, `${OtherResponseType_1.MONGODB_ERROR_MSG}:${error.message || error}`);
            }
        });
    }
    create(contentObj, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderNumber, content, rate } = contentObj;
                // use order number to get store id
                const order = yield OrderModel_1.default.findOne({ idNumber: orderNumber }, 'eventId -_id');
                if (!order) {
                    throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.DATABASE_OPERATION_FAILED, `訂單編號錯誤`);
                }
                const event = yield EventModel_1.default.findById(order === null || order === void 0 ? void 0 : order.eventId).select('storeId');
                if (!event) {
                    throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.DATABASE_OPERATION_FAILED, `Order not found`);
                }
                const storeId = event === null || event === void 0 ? void 0 : event.storeId;
                // use store id to check if review exists
                const reviewExists = yield Review_1.ReviewModel.findOne({ storeId });
                // create content object
                const newContent = {
                    rate,
                    author: userId,
                    orderNo: orderNumber,
                    content: content,
                };
                if (reviewExists) {
                    // refresh store rating
                    const newRating = (lodash_1.default.reduce(reviewExists.content, (sum, review) => sum + review.rate, 0) +
                        rate) /
                        (reviewExists.content.length + 1);
                    // add content to existing review array
                    reviewExists.content.push(newContent);
                    reviewExists.rate = newRating;
                    yield reviewExists.save();
                    return true;
                }
                else {
                    // create new review
                    yield Review_1.ReviewModel.create({
                        storeId: storeId,
                        rate,
                        content: [newContent],
                    });
                }
                return true;
            }
            catch (error) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.DATABASE_OPERATION_FAILED, `${OtherResponseType_1.MONGODB_ERROR_MSG}:${error.message || error}`);
            }
        });
    }
    update(content) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
}
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=reviewRepository.js.map