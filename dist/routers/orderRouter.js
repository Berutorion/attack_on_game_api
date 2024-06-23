"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orderController_1 = require("@/controllers/orderController");
const auth_1 = require("@/middlewares/auth");
const handleValidationErrors_1 = require("@/middlewares/handleValidationErrors");
const orderValidator_1 = require("@/validators/orderValidator");
const baseRouter_1 = require("@/routers/baseRouter");
class OrderRouter extends baseRouter_1.BaseRouter {
    constructor() {
        super();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.controller = new orderController_1.OrderController();
        this.setRouters();
    }
    setRouters() {
        this.router.post('/', auth_1.jwtAuthenticator, orderValidator_1.OrderValidator.validateOrder(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.create));
        this.router.get('/list', auth_1.jwtAuthenticator, orderValidator_1.OrderValidator.validateOrderQuery(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getAll));
        this.router.get('/:orderId', auth_1.jwtAuthenticator, orderValidator_1.OrderValidator.validateOrdertId(), handleValidationErrors_1.handleValidationErrors, this.handleRequest(this.controller.getById));
    }
}
exports.default = new OrderRouter().router;
//# sourceMappingURL=orderRouter.js.map