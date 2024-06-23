"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventController_1 = require("@/controllers/eventController");
const handleValidationErrors_1 = require("@/middlewares/handleValidationErrors");
const eventValidator_1 = require("@/validators/eventValidator");
const baseRouter_1 = require("@/routers/baseRouter");
class EventRouter extends baseRouter_1.BaseRouter {
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.controller = new eventController_1.EventController();
        this.setRouters();
    }
    setRouters() {
        this.router.post('/', eventValidator_1.EventValidator.validateEvent(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.create));
        this.router.get('/', eventValidator_1.EventValidator.validateEventQuery(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getAll));
        this.router.get('/store/:storeId/', eventValidator_1.EventValidator.validateEventQuery(), eventValidator_1.EventValidator.validateEventParam('storeId'), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getEventsByStore));
        this.router.get('/:id', eventValidator_1.EventValidator.validateEventParam('id'), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getById));
        this.router.get('/:id/summary', eventValidator_1.EventValidator.validateEventParam('id'), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getEventSummary));
        /* */
        this.router.patch('/:id', eventValidator_1.EventValidator.validateEventParam('id'), eventValidator_1.EventValidator.validateEvent(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.update));
        // this.router.put(
        //   '/:id/deactivate',
        //   this.handleRequest(this.controller.deactivateEvent),
        // );
        this.router.get('/myevents', this.handleRequest(this.controller.getOwnEvent));
    }
}
exports.default = new EventRouter().router;
//# sourceMappingURL=eventRouter.js.map