"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const orderService_1 = require("@/services/orderService");
const baseController_1 = require("@/controllers/baseController");
const OrderResponseType_1 = require("@/types/OrderResponseType");
const CustomResponseType_1 = require("@/enums/CustomResponseType");
class OrderController extends baseController_1.BaseController {
    constructor() {
        super(OrderResponseType_1.OrderResponseType);
        this.getById = (req) => __awaiter(this, void 0, void 0, function* () {
            const reqWithUser = req;
            if (!reqWithUser.user) {
                return {
                    status: CustomResponseType_1.CustomResponseType.UNAUTHORIZED,
                    message: 'User is not authenticated',
                    data: null,
                };
            }
            return yield this.handleServiceResponse(() => this.orderService.getById(reqWithUser), OrderResponseType_1.OrderResponseType.SUCCESS_REQUEST);
        });
        this.getAll = (req) => __awaiter(this, void 0, void 0, function* () {
            const reqWithUser = req;
            if (!reqWithUser.user) {
                return {
                    status: CustomResponseType_1.CustomResponseType.UNAUTHORIZED,
                    message: 'User is not authenticated',
                    data: null,
                };
            }
            return yield this.handleServiceResponse(() => this.orderService.getAll(reqWithUser), OrderResponseType_1.OrderResponseType.SUCCESS_REQUEST);
        });
        this.create = (req) => __awaiter(this, void 0, void 0, function* () {
            return this.handleServiceResponse(() => this.orderService.create(req), OrderResponseType_1.OrderResponseType.SUCCESS_CREATED);
        });
        this.orderService = new orderService_1.OrderService();
    }
    update(req) {
        throw new Error('Method not implemented.');
    }
    delete(req) {
        throw new Error('Method not implemented.');
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=orderController.js.map