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
exports.OrderService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const OrderRepository_1 = require("@/repositories/OrderRepository");
const EventRepository_1 = require("@/repositories/EventRepository");
const TicketRepository_1 = require("@/repositories/TicketRepository");
const LookupService_1 = require("./LookupService");
const eventDTO_1 = require("@/dto/eventDTO");
const orderDTO_1 = require("@/dto/orderDTO");
const orderListDTO_1 = require("@/dto/orderListDTO");
const ticketDTO_1 = require("@/dto/ticketDTO");
const CustomError_1 = require("@/errors/CustomError");
const CustomResponseType_1 = require("@/enums/CustomResponseType");
const OrderResponseType_1 = require("@/types/OrderResponseType");
const EventResponseType_1 = require("@/types/EventResponseType");
const TicketResponseType_1 = require("@/types/TicketResponseType");
const Player_1 = __importDefault(require("@/models/Player"));
const OrderStatus_1 = require("@/enums/OrderStatus");
const newEbPay_1 = require("@/utils/newEbPay");
const dayjs_1 = __importDefault(require("dayjs"));
class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository_1.OrderRepository();
        this.eventRepository = new EventRepository_1.EventRepository();
        this.ticketRepository = new TicketRepository_1.TicketRepository();
        this.lookupService = new LookupService_1.LookupService(this.orderRepository, new EventRepository_1.EventRepository(), new TicketRepository_1.TicketRepository());
    }
    getById(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield this.lookupService.findPlayer(queryParams);
            const order = yield this.lookupService.findOrder(queryParams.params.orderId);
            if (order.playerId.toString() !== player.user.toString()) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.VALIDATION_ERROR, OrderResponseType_1.OrderResponseType.FAILED_AUTHORIZATION);
            }
            const eventId = order.eventId;
            if (!eventId) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.VALIDATION_ERROR, OrderResponseType_1.OrderResponseType.FAILED_VALIDATION_EVENT_ID);
            }
            const event = yield this.lookupService.findEventByDbId(eventId);
            const targetOrderDTO = new orderDTO_1.OrderDTO(order);
            const targetEventDTO = new eventDTO_1.EventDTO(event);
            if (targetOrderDTO.status === OrderStatus_1.Status.CANCEL) {
                return {
                    event: targetEventDTO.toSummaryDTO(),
                    order: targetOrderDTO.toDetailDTO(),
                    tickets: [],
                };
            }
            const ticketList = yield this.lookupService.findTickets(order.id, player.user);
            const targetTicketsDTO = ticketList.map((ticket) => new ticketDTO_1.TicketDTO(ticket).toDetailDTO());
            return {
                event: targetEventDTO.toSummaryDTO(),
                order: targetOrderDTO.toDetailDTO(),
                tickets: targetTicketsDTO,
            };
        });
    }
    getAll(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield this.findPlayer(queryParams);
            const { limit, status, skip } = queryParams.query;
            const orderList = yield this.lookupService.findOrderList(player.user, {
                limit,
                status,
                skip,
            });
            const eventIds = orderList.map((x) => x.eventId);
            const eventList = yield this.eventRepository.getEventsData({
                _id: { $in: eventIds },
            });
            const result = orderList
                .map((x) => {
                const findEvent = eventList.find((y) => {
                    return y._id.toString() == x.eventId.toString();
                });
                if (findEvent)
                    return new orderListDTO_1.OrderListDTO(x, findEvent);
                return undefined;
            })
                .filter((x) => x !== undefined);
            return result;
        });
    }
    create(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield this.findPlayer(queryParams);
            const targetEvent = yield this.findEventById(queryParams.body.eventId);
            const targetOrderDTO = this.createOrderDTO(queryParams.body, targetEvent, player);
            this.validateOrder(targetEvent, targetOrderDTO);
            const OrderDocument = yield this.createOrder(targetOrderDTO);
            yield this.updateEventParticipants(targetEvent, targetOrderDTO);
            try {
                const aesEncrypt = (0, newEbPay_1.createSesEncrypt)({
                    MerchantOrderNo: OrderDocument.idNumber,
                    TimeStamp: (0, dayjs_1.default)(OrderDocument.createdAt).unix(),
                    Amt: OrderDocument.payment,
                    ItemDesc: targetEvent.title,
                });
                const shaEncrypt = (0, newEbPay_1.createShaEncrypt)(aesEncrypt);
                console.log(aesEncrypt, shaEncrypt);
                return {
                    MerchantID: process.env.MerchantID,
                    TradeInfo: aesEncrypt,
                    TradeSha: shaEncrypt,
                    Version: process.env.Version,
                };
            }
            catch (error) {
                console.log(error);
            }
            // await this.createTickets(
            //   OrderDocument.id,
            //   player.user,
            //   targetOrderDTO.registrationCount,
            // );
        });
    }
    findPlayer(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield Player_1.default.findOne({ user: queryParams.user });
            if (lodash_1.default.isEmpty(player)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, OrderResponseType_1.OrderResponseType.ERROR_PLAYER_FOUND);
            }
            return player;
        });
    }
    findOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findById(orderId);
            if (lodash_1.default.isEmpty(order)) {
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
            return order.map((order) => new orderDTO_1.OrderDTO(order));
        });
    }
    findEventByDbId(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.eventRepository.findByDBId(eventId);
            if (lodash_1.default.isEmpty(event)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
            }
            return event;
        });
    }
    findEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.eventRepository.findById(eventId);
            if (lodash_1.default.isEmpty(event)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
            }
            return event;
        });
    }
    findTickets(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketList = yield this.ticketRepository.findAll(orderId, userId);
            if (lodash_1.default.isEmpty(ticketList)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, TicketResponseType_1.TicketResponseType.FAILED_FOUND);
            }
            return ticketList;
        });
    }
    createOrderDTO(body, event, player) {
        return new orderDTO_1.OrderDTO(Object.assign(Object.assign({}, body), { eventId: event._id, playerId: player.user }));
    }
    validateOrder(event, orderDTO) {
        const targetEventDTO = new eventDTO_1.EventDTO(event);
        if (!targetEventDTO.isRegisterable) {
            throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.VALIDATION_ERROR, OrderResponseType_1.OrderResponseType.CREATED_ERROR_REGISTRATION_PERIOD);
        }
        if (targetEventDTO.participationFee * orderDTO.registrationCount !==
            orderDTO.getTotalAmount) {
            throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.VALIDATION_ERROR, OrderResponseType_1.OrderResponseType.CREATED_ERROR_MONEY);
        }
        if (targetEventDTO.availableSeat < orderDTO.registrationCount) {
            throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.VALIDATION_ERROR, OrderResponseType_1.OrderResponseType.CREATED_ERROR_EXCEEDS_CAPACITY);
        }
    }
    createOrder(orderDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.create(orderDTO.toDetailDTO());
        });
    }
    updateEventParticipants(event, orderDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetEventDTO = new eventDTO_1.EventDTO(event);
            const addedSeat = targetEventDTO.currentParticipantsCount + orderDTO.registrationCount;
            yield this.eventRepository.updateParticipantsCount(targetEventDTO, addedSeat);
        });
    }
    createTickets(orderId, userId, registrationCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketPromises = [];
            for (let index = 0; index < registrationCount; index++) {
                ticketPromises.push(this.ticketRepository.create(orderId, userId));
            }
            yield Promise.all(ticketPromises);
        });
    }
}
exports.OrderService = OrderService;
exports.default = OrderService;
//# sourceMappingURL=orderService.js.map