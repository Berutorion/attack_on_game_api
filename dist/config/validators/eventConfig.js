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
const EventStatus_1 = require("@/enums/EventStatus");
const EventRequest_1 = require("@/enums/EventRequest");
const validateEventTimesOrder = (value, { req }) => {
    const { eventStartTime, eventEndTime, registrationStartTime, registrationEndTime, } = req.body;
    if ((0, dayjs_1.default)(registrationStartTime).isAfter((0, dayjs_1.default)(registrationEndTime))) {
        throw new Error('註冊開始時間不能晚於註冊結束時間哦！');
    }
    if ((0, dayjs_1.default)(eventStartTime).isAfter((0, dayjs_1.default)(eventEndTime))) {
        throw new Error('活動開始時間不能晚於活動結束時間哦！');
    }
    if ((0, dayjs_1.default)(registrationEndTime).isAfter((0, dayjs_1.default)(eventStartTime))) {
        throw new Error('註冊結束時間不能晚於活動開始時間哦！');
    }
    return true;
};
exports.validationConfig = {
    body: {
        storeId: [
            (0, express_validator_1.body)('storeId')
                .optional()
                .custom(commonConfig_1.isValidObjectId)
                .withMessage('商店ID格式不對哦！'),
        ],
        title: [
            (0, express_validator_1.body)('title')
                .notEmpty()
                .withMessage('標題不能為空哦！')
                .isString()
                .withMessage('標題必須是字串哦！'),
        ],
        description: [
            (0, express_validator_1.body)('description')
                .notEmpty()
                .withMessage('描述不能為空哦！')
                .isString()
                .withMessage('描述必須是字串哦！'),
        ],
        eventStartTime: [
            (0, express_validator_1.body)('eventStartTime')
                .notEmpty()
                .withMessage('活動開始時間不能為空哦！')
                .custom((value, { req, location, path }) => (0, commonConfig_1.isFutureDate)(value, { req, location, path }))
                .custom((value, { req, location, path }) => (0, commonConfig_1.isValidDateFormat)(value, { req, location, path })),
        ],
        eventEndTime: [
            (0, express_validator_1.body)('eventEndTime')
                .notEmpty()
                .withMessage('活動結束時間不能為空哦！')
                .custom((value, { req, location, path }) => (0, commonConfig_1.isValidDateFormat)(value, { req, location, path }))
                .custom((value, { req, location, path }) => (0, commonConfig_1.isFutureDate)(value, { req, location, path })),
        ],
        registrationStartTime: [
            (0, express_validator_1.body)('registrationStartTime')
                .notEmpty()
                .withMessage('註冊開始時間不能為空哦！')
                .custom((value, { req, location, path }) => (0, commonConfig_1.isValidDateFormat)(value, { req, location, path })),
        ],
        registrationEndTime: [
            (0, express_validator_1.body)('registrationEndTime')
                .notEmpty()
                .withMessage('註冊結束時間不能為空哦！')
                .custom((value, { req, location, path }) => (0, commonConfig_1.isValidDateFormat)(value, { req, location, path }))
                .custom((value, { req, location, path }) => (0, commonConfig_1.isFutureDate)(value, { req, location, path }))
                .custom(validateEventTimesOrder),
        ],
        address: [
            (0, express_validator_1.body)('address')
                .notEmpty()
                .withMessage('地址不能為空哦！')
                .isString()
                .withMessage('地址必須是字串哦！'),
        ],
        isFoodAllowed: [
            (0, express_validator_1.body)('isFoodAllowed')
                .notEmpty()
                .withMessage('是否允許食物不能為空哦！')
                .isBoolean()
                .withMessage('是否允許食物必須是布爾值哦！'),
        ],
        maxParticipants: [
            (0, express_validator_1.body)('maxParticipants')
                .notEmpty()
                .withMessage('最大參與人數不能為空哦！')
                .isInt({ min: 1 })
                .withMessage('最大參與人數必須是一個正整數哦！'),
        ],
        minParticipants: [
            (0, express_validator_1.body)('minParticipants')
                .notEmpty()
                .withMessage('最小參與人數不能為空哦！')
                .isInt({ min: 1 })
                .withMessage('最小參與人數必須是一個正整數哦！'),
            (0, express_validator_1.body)('minParticipants').custom((value, { req }) => {
                if (value > req.body.maxParticipants) {
                    throw new Error('最小參與人數不能大於最大參與人數哦！');
                }
                return true;
            }),
        ],
        participationFee: [
            (0, express_validator_1.body)('participationFee')
                .notEmpty()
                .withMessage('參與費用不能為空哦！')
                .isInt({ min: 0 })
                .withMessage('參與費用必須是一個非負數哦！'),
        ],
        eventImageUrl: [
            (0, express_validator_1.body)('eventImageUrl')
                .notEmpty()
                .withMessage('活動圖片URL不能為空哦！')
                .isArray({ min: 1 })
                .withMessage('活動圖片URL必須是一個非空數組哦！')
                .custom((value) => {
                for (const url of value) {
                    if (!/^https?:\/\/.+\..+$/.test(url)) {
                        throw new Error('活動圖片URL格式不對哦！');
                    }
                }
                return true;
            }),
        ],
    },
    query: {
        limit: [
            (0, express_validator_1.query)('limit')
                .optional()
                .isInt({ min: 1, max: Number(EventRequest_1.DefaultQuery.MAX_LIMIT) })
                .toInt()
                .withMessage('請輸入有效的最小參與人數！'),
        ],
        skip: [
            (0, express_validator_1.query)('skip')
                .optional()
                .isInt({ min: 0 })
                .toInt()
                .withMessage('請輸入有效的跳過值！'),
        ],
        formationStatus: [
            (0, express_validator_1.query)('formationStatus')
                .optional()
                .isIn(Object.values(EventStatus_1.EventFormationStatus))
                .toInt()
                .withMessage('請選擇有效的成團狀態！'),
        ],
        registrationStatus: [
            (0, express_validator_1.query)('registrationStatus')
                .optional()
                .isIn(Object.values(EventStatus_1.EventRegistrationStatus))
                .toInt()
                .withMessage('請選擇有效的報名狀態！'),
        ],
        sortBy: [
            (0, express_validator_1.query)('sortBy')
                .optional()
                .isIn(Object.values(EventStatus_1.SortBy))
                .withMessage('請選擇有效的排序欄位！'),
        ],
        sortOrder: [
            (0, express_validator_1.query)('sortOrder')
                .optional()
                .isIn(Object.values(EventStatus_1.SortOrder))
                .withMessage('請選擇有效的排序順序！'),
        ],
    },
    param: {
        id: [
            (0, express_validator_1.param)('id')
                .custom(commonConfig_1.isValidNanoid)
                .withMessage('請提供有效的 6位數Id 格式'),
        ],
        storeId: [
            (0, express_validator_1.param)('storeId')
                .custom(commonConfig_1.isValidObjectId)
                .withMessage('請提供有效的 ObjectId 格式'),
        ],
    },
};
//# sourceMappingURL=eventConfig.js.map