"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const baseController_1 = require("./baseController");
const reviewService_1 = require("../services/reviewService");
const ReviewResponseType_1 = require("@/types/ReviewResponseType");
const help_1 = require("@/utils/help");
class ReviewController extends baseController_1.BaseController {
    constructor() {
        super(ReviewResponseType_1.ReviewResponseType);
        this.getAllReviews = (req) => {
            return this.handleServiceResponse(() => this.reviewService.getAll(req.params.storeId), ReviewResponseType_1.ReviewResponseType.SUCCESS_REQUEST);
        };
        this.createReview = (req) => {
            const user = (0, help_1.getUser)(req);
            req.body.userId = user.id;
            const content = req.body;
            return this.handleServiceResponse(() => this.reviewService.create(content), ReviewResponseType_1.ReviewResponseType.SUCCESS_REQUEST);
        };
        this.reviewService = new reviewService_1.ReviewService();
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=reviewController.js.map