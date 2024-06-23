"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseRouter_1 = require("./baseRouter");
const reviewController_1 = require("@/controllers/reviewController");
const reviewValidator_1 = require("@/validators/reviewValidator");
const handleValidationErrors_1 = require("@/middlewares/handleValidationErrors");
const auth_1 = require("@/middlewares/auth");
class ReviewRouter extends baseRouter_1.BaseRouter {
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.controller = new reviewController_1.ReviewController();
        this.setRouters();
    }
    setRouters() {
        this.router.post('/', auth_1.jwtAuthenticator, reviewValidator_1.ReviewValidator.validateReview(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.createReview));
        this.router.get('/:storeId', auth_1.jwtAuthenticator, reviewValidator_1.ReviewValidator.validateObjectIds('storeId'), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getAllReviews));
    }
}
exports.default = new ReviewRouter().router;
//# sourceMappingURL=review.js.map