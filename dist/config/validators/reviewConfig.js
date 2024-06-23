"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationConfig = void 0;
const express_validator_1 = require("express-validator");
exports.validationConfig = {
    body: {
        content: [
            (0, express_validator_1.body)('content')
                .notEmpty()
                .withMessage('內容不能為空哦！')
                .isString()
                .withMessage('內容必須是字符串！'),
        ],
        rate: [
            (0, express_validator_1.body)('rate')
                .notEmpty()
                .withMessage('評分不能為空哦！')
                .isFloat({ min: 0, max: 5 })
                .withMessage('評分必須在 0 到 5 之間！'),
        ],
        orderNumber: [
            (0, express_validator_1.body)('orderNumber')
                .notEmpty()
                .withMessage('訂單號不能為空哦！')
                .isString()
                .withMessage('訂單號必須是字符串！'),
        ],
    },
    query: {},
    param: {
        storeId: [
            (0, express_validator_1.param)('storeId')
                .notEmpty()
                .withMessage('storeId 不能為空')
                .isString()
                .withMessage('storeId 必須是字符串'),
        ],
    },
};
//# sourceMappingURL=reviewConfig.js.map