"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myEventController_1 = require("@/controllers/myEventController");
const auth_1 = require("@/middlewares/auth");
const handleValidationErrors_1 = require("@/middlewares/handleValidationErrors");
const myEventValidator_1 = require("@/validators/myEventValidator");
const baseRouter_1 = require("@/routers/baseRouter");
class MyEventRouter extends baseRouter_1.BaseRouter {
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.controller = new myEventController_1.MyEventController();
        this.setRouters();
    }
    setRouters() {
        this.router.get('/list', auth_1.jwtAuthenticator, myEventValidator_1.EventValidator.validateEventQuery(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getAll));
        this.router.get('/:eventId', auth_1.jwtAuthenticator, myEventValidator_1.EventValidator.validateEventParam(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getById));
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
exports.default = new MyEventRouter().router;
//# sourceMappingURL=myEventRouter.js.map