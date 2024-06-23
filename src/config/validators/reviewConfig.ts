import { body, param, ValidationChain } from 'express-validator';

type ValidationConfig = {
  [key: string]: ValidationChain[];
};

export const validationConfig: {
  body: ValidationConfig;
  query: ValidationConfig;
  param: ValidationConfig;
} = {
  body: {
    content: [
      body('content')
        .notEmpty()
        .withMessage('內容不能為空哦！')
        .isString()
        .withMessage('內容必須是字符串！'),
    ],
    rate: [
      body('rate')
        .notEmpty()
        .withMessage('評分不能為空哦！')
        .isFloat({ min: 0, max: 5 })
        .withMessage('評分必須在 0 到 5 之間！'),
    ],
    orderNumber: [
      body('orderNumber')
        .notEmpty()
        .withMessage('訂單號不能為空哦！')
        .isString()
        .withMessage('訂單號必須是字符串！'),
    ],
  },
  query: {},
  param: {
    storeId: [
      param('storeId')
        .notEmpty()
        .withMessage('storeId 不能為空')
        .isString()
        .withMessage('storeId 必須是字符串'),
    ],
  },
};
