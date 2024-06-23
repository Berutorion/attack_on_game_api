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
exports.MyEventController = void 0;
const myEventService_1 = require("@/services/myEventService");
const baseController_1 = require("@/controllers/baseController");
const myEventResponseType_1 = require("@/types/myEventResponseType");
class MyEventController extends baseController_1.BaseController {
    constructor() {
        super(myEventResponseType_1.ResponseType);
        this.getById = (req) => __awaiter(this, void 0, void 0, function* () {
            return this.handleServiceResponse(() => this.eventService.getOrderByEventId(req), myEventResponseType_1.ResponseType.SUCCESS_REQUEST);
        });
        this.getAll = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.handleServiceResponse(() => this.eventService.getAllEventOrder(req), myEventResponseType_1.ResponseType.SUCCESS_REQUEST);
        });
        this.eventService = new myEventService_1.MyEventService();
    }
}
exports.MyEventController = MyEventController;
//# sourceMappingURL=myEventController.js.map