import { body, query, param, ValidationChain } from 'express-validator';
import { isValidNanoid } from '@/config/validators/commonConfig';
type ValidationConfig = {
  [key: string]: ValidationChain[];
};
import { DefaultQuery } from '@/enums/OrderRequest';
import { Status } from '@/enums/OrderStatus';
export const validationConfig: {
  body: ValidationConfig;
  query: ValidationConfig;
  param: ValidationConfig;
} = {
  body: {
    eventId: [
      body('eventId')
        .custom(isValidNanoid)
        .withMessage('eventId 必須符合資料庫結構')
        .notEmpty()
        .withMessage('eventId 不能為空'),
    ],
    payment: [
      body('payment')
        .isInt({ min: 0 })
        .withMessage('payment 必須是一個整數')
        .notEmpty()
        .withMessage('payment 不能為空'),
    ],
    discount: [
      body('discount')
        .isInt({ min: 0 })
        .withMessage('discount 必須是一個整數')
        .notEmpty()
        .withMessage('discount 不能為空'),
    ],
    name: [
      body('name')
        .isString()
        .withMessage('name 必須是一個字符串')
        .notEmpty()
        .withMessage('name 不能為空'),
    ],
    phone: [
      body('phone')
        .isString()
        .withMessage('phone 必須是一個字符串')
        .notEmpty()
        .withMessage('phone 不能為空'),
    ],
    registrationCount: [
      body('registrationCount')
        .isInt({ min: 1 })
        .withMessage('registrationCount 必須是一個整數')
        .notEmpty()
        .withMessage('registrationCount 不能為空'),
    ],
    notes: [
      body('notes').optional().isString().withMessage('notes 必須是一個字符串'),
    ],
  },
  query: {
    status: [
      query('status')
        .optional()
        .isIn(Object.values(Status))
        .withMessage('請選擇有效的訂單狀態！')
        .isString()
        .withMessage('請選擇純文字！'),
    ],
    limit: [
      query('limit')
        .optional()
        .isInt({ min: 1, max: Number(DefaultQuery.LIMIT) })
        .toInt()
        .withMessage('請輸入有效的最小筆數！'),
    ],
    skip: [
      query('skip')
        .optional()
        .isInt({ min: 0 })
        .toInt()
        .withMessage('請輸入有效的跳過值！'),
    ],
  },
  param: {
    orderId: [
      param('orderId')
        .matches(/^o-[0-9]{6}-[a-z0-9]{4}$/)
        .withMessage('錯誤的訂單編號'),
    ],
  },
};
