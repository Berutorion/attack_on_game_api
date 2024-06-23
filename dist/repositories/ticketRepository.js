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
exports.TicketRepository = void 0;
const TicketModel_1 = __importDefault(require("@/models/TicketModel"));
const CustomResponseType_1 = require("@/enums/CustomResponseType");
const CustomError_1 = require("@/errors/CustomError");
const TicketResponseType_1 = require("@/types/TicketResponseType");
const qrcode_1 = __importDefault(require("qrcode"));
const generateCustomNanoId_1 = require("@/utils/generateCustomNanoId");
const lodash_1 = __importDefault(require("lodash"));
const ticketDTO_1 = require("@/dto/ticketDTO");
function handleDatabaseError(error, message) {
    throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.DATABASE_OPERATION_FAILED, `${message}:${error.message || error}`);
}
class TicketRepository {
    create(orderId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idNumber = (0, generateCustomNanoId_1.generateCustomNanoId)();
                const qrCodeUrl = yield this.generateQRCode(idNumber);
                const ticketDTO = new ticketDTO_1.TicketDTO({
                    orderId,
                    qrCodeUrl: qrCodeUrl,
                    playerId,
                });
                yield TicketModel_1.default.create(ticketDTO);
                return true;
            }
            catch (error) {
                handleDatabaseError(error, TicketResponseType_1.TicketResponseType.FAILED_CREATED);
            }
        });
    }
    markQrCodeAsUsed(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield TicketModel_1.default.findOneAndUpdate({ idNumber: content.idNumber }, {
                    isQrCodeUsed: true,
                    updatedAt: new Date().toISOString(),
                }, { new: true }).exec();
            }
            catch (error) {
                handleDatabaseError(error, TicketResponseType_1.TicketResponseType.FAILED_UPDATE);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield TicketModel_1.default.findOne({ idNumber: id });
                if (lodash_1.default.isEmpty(ticket)) {
                    throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, TicketResponseType_1.TicketResponseType.FAILED_FOUND);
                }
                return ticket;
            }
            catch (error) {
                handleDatabaseError(error, TicketResponseType_1.TicketResponseType.FAILED_FOUND);
            }
        });
    }
    findAll(orderId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield TicketModel_1.default.find({ orderId, playerId });
                if (lodash_1.default.isEmpty(tickets)) {
                    throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.NOT_FOUND, TicketResponseType_1.TicketResponseType.FAILED_FOUND);
                }
                return tickets;
            }
            catch (error) {
                handleDatabaseError(error, TicketResponseType_1.TicketResponseType.FAILED_FOUND);
            }
        });
    }
    generateQRCode(idNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const baseUrl = process.env.QRCODE_BASE_URL;
                if (!baseUrl) {
                    throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.VALIDATION_ERROR, `QRCODE_BASE_URL 並不存在於.env環境內，請快點加上吧:${baseUrl}`);
                }
                const url = `${baseUrl}/order/my-ticket?qrCodeId=${idNumber}`;
                return yield qrcode_1.default.toDataURL(url);
            }
            catch (error) {
                throw new CustomError_1.CustomError(CustomResponseType_1.CustomResponseType.VALIDATION_ERROR, `${TicketResponseType_1.TicketResponseType.FAILED_CREATED}:${error.message || error}`);
            }
        });
    }
}
exports.TicketRepository = TicketRepository;
//# sourceMappingURL=TicketRepository.js.map