import { MyEventController } from '@/controllers/myEventController';
import { jwtAuthenticator } from '@/middlewares/auth';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { EventValidator } from '@/validators/myEventValidator';
import { BaseRouter } from '@/routers/baseRouter';
class MyEventRouter extends BaseRouter {
  protected controller!: MyEventController;
  constructor() {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.controller = new MyEventController();
    this.setRouters();
  }
  protected setRouters(): void {
    this.router.get(
      '/list',
      jwtAuthenticator,
      EventValidator.validateEventQuery(),
      handleValidationErrors,
      this.handleRequest(this.controller.getAll),
    );
    this.router.get(
      '/:eventId',
      jwtAuthenticator,
      EventValidator.validateEventParam(),
      handleValidationErrors,
      this.handleRequest(this.controller.getById),
    );
    // this.router.patch(
    //   '/cancel-user',
    //   jwtAuthenticator,
    //   EventValidator.validateEventBody('playerId'),
    //   handleValidationErrors,
    //   this.handleRequest(this.controller.deletUser),
    // );
    // this.router.patch(
    //   '/cancel-event',
    //   jwtAuthenticator,
    //   EventValidator.validateEventBody('eventId'),
    //   handleValidationErrors,
    //   this.handleRequest(this.controller.deletEvent),
    // );
  }
}
export default new MyEventRouter().router;
