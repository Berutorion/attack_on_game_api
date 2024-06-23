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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const Player_1 = __importDefault(require("@/models/Player"));
const CustomError_1 = require("@/errors/CustomError");
const CustomResponseType_1 = require("@/enums/CustomResponseType");
const OrderResponseType_1 = require("@/types/OrderResponseType");
const EventResponseType_1 = require("@/types/EventResponseType");
const TicketResponseType_1 = require("@/types/TicketResponseType");
const Store_1 = require("@/models/Store");
class LookupService {
    constructor(orderRepository, EventRepository, ticketRepository) {
        this.orderRepository = orderRepository;
        this.EventRepository = EventRepository;
        this.ticketRepository = ticketRepository;
    }
    findStore(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqWithUser = queryParams;
            if (!reqWithUser.user) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, OrderResponseType_1.OrderResponseType.ERROR_PLAYER_FOUND);
            }
            const store = yield Store_1.Store.findOne({ user: reqWithUser.user });
            if (lodash_1.default.isEmpty(store)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, OrderResponseType_1.OrderResponseType.ERROR_PLAYER_FOUND);
            }
            return store;
        });
    }
    findPlayer(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqWithUser = queryParams;
            if (!reqWithUser.user) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, OrderResponseType_1.OrderResponseType.ERROR_PLAYER_FOUND);
            }
            const player = yield Player_1.default.findOne({ user: reqWithUser.user });
            if (lodash_1.default.isEmpty(player)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, OrderResponseType_1.OrderResponseType.ERROR_PLAYER_FOUND);
            }
            return player;
        });
    }
    findOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findById(orderId);
            if (!order) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, OrderResponseType_1.OrderResponseType.FAILED_FOUND);
            }
            return order;
        });
    }
    findOrderList(playerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryObject = {
                playerId,
            };
            if (query.status) {
                queryObject.status = query.status;
            }
            const order = yield this.orderRepository.findAll(queryObject, {
                limit: query.limit,
                skip: query.skip,
            });
            if (lodash_1.default.isEmpty(order)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, OrderResponseType_1.OrderResponseType.FAILED_FOUND);
            }
            return order;
        });
    }
    findEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.EventRepository.findById(eventId);
            if (!event) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
            }
            return event;
        });
    }
    findEventByDbId(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.EventRepository.findByDBId(eventId);
            if (!event) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
            }
            return event;
        });
    }
    findTickets(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketList = yield this.ticketRepository.findAll(orderId, userId);
            if (!ticketList.length) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, TicketResponseType_1.TicketResponseType.FAILED_FOUND);
            }
            return ticketList;
        });
    }
}
exports.LookupService = LookupService;
//# sourceMappingURL=LookupService.js.map