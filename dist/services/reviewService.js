"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const reviewRepository_1 = require("@/repositories/reviewRepository");
const lodash_1 = __importDefault(require("lodash"));
class ReviewService {
    constructor() {
        this.reviewRepository = new reviewRepository_1.ReviewRepository();
    }
    getById(id) {
        throw new Error('Method not implemented.');
    }
    getAll(storeId) {
        if (lodash_1.default.isEmpty(storeId)) {
            throw new Error('No storeId provided');
        }
        return this.reviewRepository.findAll({ storeId: storeId });
    }
    create(content) {
        return this.reviewRepository.create(content, content.userId);
    }
    update(id, content) {
        throw new Error('Method not implemented.');
    }
    delete(id) {
        throw new Error('Method not implemented.');
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=reviewService.js.map