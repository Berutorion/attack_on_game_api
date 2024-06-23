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
exports.EventService = void 0;
//TODO:上傳照片的方式可能也要研究一下
//TODO:寫一個fs模塊，批量上傳假資料
const lodash_1 = __importDefault(require("lodash"));
const eventDTO_1 = require("@/dto/eventDTO");
const EventRepository_1 = require("@/repositories/EventRepository");
const eventQueryParams_1 = require("@/services/eventQueryParams");
const CustomResponseType_1 = require("@/enums/CustomResponseType");
const CustomError_1 = require("@/errors/CustomError");
const EventResponseType_1 = require("@/types/EventResponseType");
class EventService {
    constructor() {
        this.EventRepository = new EventRepository_1.EventRepository();
        this.queryParams = new eventQueryParams_1.QueryParamsParser();
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.EventRepository.findById(id);
            const eventDTO = new eventDTO_1.EventDTO(event);
            if (!eventDTO.isPublish) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.UNAUTHORIZED, EventResponseType_1.EventResponseType.FAILED_AUTHORIZATION);
            }
            return eventDTO.toDetailDTO();
        });
    }
    getAll(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const _queryParams = this.queryParams.parse(queryParams);
            const eventData = yield this.EventRepository.findAll(_queryParams);
            if (lodash_1.default.isEmpty(eventData)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
            }
            return lodash_1.default.map(eventData, (event) => new eventDTO_1.EventDTO(event).toDetailDTO());
        });
    }
    create(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const _content = new eventDTO_1.EventDTO(content).toDetailDTO();
            return yield this.EventRepository.create(_content);
        });
    }
    update(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateContent = Object.assign(Object.assign({}, content), { idNumber: id });
            const _content = new eventDTO_1.EventDTO(updateContent);
            const _event = yield this.EventRepository.update(_content);
            if (!lodash_1.default.isEmpty(_event)) {
                const _eventDTO = new eventDTO_1.EventDTO(_event);
                return _eventDTO.toDetailDTO();
            }
            throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
        });
    }
    delete(id) {
        throw new Error('Method not implemented.');
    }
    getEventsForStore(storeId, optionsReq) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryParams = this.queryParams.parse(optionsReq);
            const eventData = yield this.EventRepository.getEventsByStoreId(storeId, queryParams);
            if (!lodash_1.default.isEmpty(eventData)) {
                const eventDTOs = lodash_1.default.map(eventData, (event) => new eventDTO_1.EventDTO(event).toDetailDTO());
                return eventDTOs;
            }
            throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
        });
    }
    getSummaryEvents(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.EventRepository.findById(id);
            if (lodash_1.default.isEmpty(event)) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, EventResponseType_1.EventResponseType.FAILED_FOUND);
            }
            const _eventDTO = new eventDTO_1.EventDTO(event);
            if (_eventDTO.isPublish && _eventDTO.isRegisterable) {
                return _eventDTO.toSummaryDTO();
            }
            throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.UNAUTHORIZED, EventResponseType_1.EventResponseType.FAILED_AUTHORIZATION);
        });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map