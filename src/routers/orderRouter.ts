import { OrderController } from '@/controllers/orderController';
import { jwtAuthenticator } from '@/middlewares/auth';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { OrderValidator } from '@/validators/orderValidator';
import { BaseRouter } from '@/routers/baseRouter';
class OrderRouter extends BaseRouter {
  protected controller!: OrderController;
  constructor() {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.controller = new OrderController();
    this.setRouters();
  }
  protected setRouters(): void {
    this.router.post(
      '/',
      jwtAuthenticator,
      OrderValidator.validateOrder(),
      handleValidationErrors,
      this.handleRequest(this.controller.create),
    );
    this.router.get(
      '/list',
      jwtAuthenticator,
      OrderValidator.validateOrderQuery(),
      handleValidationErrors,
      this.handleRequest(this.controller.getAll),
    );
    this.router.get(
      '/:orderId',
      jwtAuthenticator,
      OrderValidator.validateOrdertId(),
      handleValidationErrors,
      this.handleRequest(this.controller.getById),
    );
  }
}
export default new OrderRouter().router;
