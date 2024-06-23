"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationConfig = void 0;
const express_validator_1 = require("express-validator");
const commonConfig_1 = require("@/config/validators/commonConfig");
const dayjs_1 = __importDefault(require("dayjs"));
const isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore"));
dayjs_1.default.extend(isSameOrBefore_1.default);
const EventRequest_1 = require("@/enums/EventRequest");
const validateEventTimesOrder = (value, { req }) => {
    const { startTime, endTime } = req.query;
    if ((0, dayjs_1.default)(startTime).isAfter((0, dayjs_1.default)(endTime))) {
        throw new Error('註冊開始時間不能晚於註冊結束時間哦！');
    }
};
exports.validationConfig = {
    body: {
        playerId: [
            (0, express_validator_1.body)('playerId')
                .custom(commonConfig_1.isValidObjectId)
                .withMessage('玩家ID格式不對哦！'),
        ],
        eventId: [
            (0, express_validator_1.body)('eventId').custom(commonConfig_1.isValidNanoid).withMessage('活動ID格式不對哦！'),
        ],
    },
    query: {
        limit: [
            (0, express_validator_1.query)('limit')
                .optional()
                .isInt({ min: 1, max: Number(EventRequest_1.DefaultQuery.LIMIT) })
                .toInt()
                .withMessage('請輸入有效的最小筆數！'),
        ],
        skip: [
            (0, express_validator_1.query)('skip')
                .optional()
                .isInt({ min: 0 })
                .toInt()
                .withMessage('請輸入有效的跳過值！'),
        ],
        startTime: [(0, express_validator_1.query)('startTime').optional()],
        endTime: [(0, express_validator_1.query)('endTime').optional()],
    },
    param: {
        eventId: [
            (0, express_validator_1.param)('eventId')
                .custom(commonConfig_1.isValidNanoid)
                .withMessage('請提供有效的 6位數Id 格式'),
        ],
    },
};
//# sourceMappingURL=myEventConfig.js.map