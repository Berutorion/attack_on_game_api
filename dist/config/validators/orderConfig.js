"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationConfig = void 0;
const express_validator_1 = require("express-validator");
const commonConfig_1 = require("@/config/validators/commonConfig");
const OrderRequest_1 = require("@/enums/OrderRequest");
const OrderStatus_1 = require("@/enums/OrderStatus");
exports.validationConfig = {
    body: {
        eventId: [
            (0, express_validator_1.body)('eventId')
                .custom(commonConfig_1.isValidNanoid)
                .withMessage('eventId 必須符合資料庫結構')
                .notEmpty()
                .withMessage('eventId 不能為空'),
        ],
        payment: [
            (0, express_validator_1.body)('payment')
                .isInt({ min: 0 })
                .withMessage('payment 必須是一個整數')
                .notEmpty()
                .withMessage('payment 不能為空'),
        ],
        discount: [
            (0, express_validator_1.body)('discount')
                .isInt({ min: 0 })
                .withMessage('discount 必須是一個整數')
                .notEmpty()
                .withMessage('discount 不能為空'),
        ],
        name: [
            (0, express_validator_1.body)('name')
                .isString()
                .withMessage('name 必須是一個字符串')
                .notEmpty()
                .withMessage('name 不能為空'),
        ],
        phone: [
            (0, express_validator_1.body)('phone')
                .isString()
                .withMessage('phone 必須是一個字符串')
                .notEmpty()
                .withMessage('phone 不能為空'),
        ],
        registrationCount: [
            (0, express_validator_1.body)('registrationCount')
                .isInt({ min: 1 })
                .withMessage('registrationCount 必須是一個整數')
                .notEmpty()
                .withMessage('registrationCount 不能為空'),
        ],
        notes: [
            (0, express_validator_1.body)('notes').optional().isString().withMessage('notes 必須是一個字符串'),
        ],
    },
    query: {
        status: [
            (0, express_validator_1.query)('status')
                .optional()
                .isIn(Object.values(OrderStatus_1.Status))
                .withMessage('請選擇有效的訂單狀態！')
                .isString()
                .withMessage('請選擇純文字！'),
        ],
        limit: [
            (0, express_validator_1.query)('limit')
                .optional()
                .isInt({ min: 1, max: Number(OrderRequest_1.DefaultQuery.LIMIT) })
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
    },
    param: {
        orderId: [
            (0, express_validator_1.param)('orderId')
                .matches(/^o-[0-9]{6}-[a-z0-9]{4}$/)
                .withMessage('錯誤的訂單編號'),
        ],
    },
};
//# sourceMappingURL=orderConfig.js.map