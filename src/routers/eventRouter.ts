import { EventController } from '@/controllers/eventController';
import { handleValidationErrors } from '@/middlewares/handleValidationErrors';
import { EventValidator } from '@/validators/eventValidator';
import { BaseRouter } from '@/routers/baseRouter';
class EventRouter extends BaseRouter {
  protected controller!: EventController;
  constructor() {
    super();
    this.initializeRoutes();
  }
  protected initializeRoutes(): void {
    this.controller = new EventController();
    this.setRouters();
  }
  protected setRouters(): void {
    this.router.post(
      '/',
      EventValidator.validateEvent(),
      handleValidationErrors,
      this.handleRequest(this.controller.create),
    );
    this.router.get(
      '/',
      EventValidator.validateEventQuery(),
      handleValidationErrors,
      this.handleRequest(this.controller.getAll),
    );
    this.router.get(
      '/store/:storeId/',
      EventValidator.validateEventQuery(),
      EventValidator.validateEventParam('storeId'),
      handleValidationErrors,
      this.handleRequest(this.controller.getEventsByStore),
    );
    this.router.get(
      '/:id',
      EventValidator.validateEventParam('id'),
      handleValidationErrors,
      this.handleRequest(this.controller.getById),
    );
    this.router.get(
      '/:id/summary',
      EventValidator.validateEventParam('id'),
      handleValidationErrors,
      this.handleRequest(this.controller.getEventSummary),
    );
    /* */
    this.router.patch(
      '/:id',
      EventValidator.validateEventParam('id'),
      EventValidator.validateEvent(),
      handleValidationErrors,
      this.handleRequest(this.controller.update),
    );
    // this.router.put(
    //   '/:id/deactivate',
    //   this.handleRequest(this.controller.deactivateEvent),
    // );
    this.router.get(
      '/myevents',
      this.handleRequest(this.controller.getOwnEvent),
    );
  }
}
export default new EventRouter().router;
