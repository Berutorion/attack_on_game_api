import { BaseRouter } from './baseRouter';
import { ReviewController } from '@/controllers/reviewController';
import { ReviewValidator } from '@/validators/reviewValidator';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { jwtAuthenticator } from '@/middlewares/auth';

class ReviewRouter extends BaseRouter {
  protected controller!: ReviewController;
  constructor() {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.controller = new ReviewController();
    this.setRouters();
  }
  protected setRouters(): void {
    this.router.post(
      '/',
      jwtAuthenticator,
      ReviewValidator.validateReview(),
      handleValidationErrors,
      this.handleRequest(this.controller.createReview),
    );
    this.router.get(
      '/:storeId',
      jwtAuthenticator,
      ReviewValidator.validateObjectIds('storeId'),
      handleValidationErrors,
      this.handleRequest(this.controller.getAllReviews),
    );
  }
}

export default new ReviewRouter().router;
