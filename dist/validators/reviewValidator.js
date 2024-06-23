"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidator = void 0;
const reviewConfig_1 = require("@/config/validators/reviewConfig");
class ReviewValidator {
    static validateReview() {
        return Object.values(reviewConfig_1.validationConfig.body).flat();
    }
    static validateReviewQuery() {
        return Object.values(reviewConfig_1.validationConfig.query).flat();
    }
    static validateObjectIds(parameters) {
        return reviewConfig_1.validationConfig.param[parameters];
    }
}
exports.ReviewValidator = ReviewValidator;
//# sourceMappingURL=reviewValidator.js.map