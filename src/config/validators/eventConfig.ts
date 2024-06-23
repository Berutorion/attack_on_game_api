import {
  body,
  query,
  param,
  ValidationChain,
  CustomValidator,
} from 'express-validator';
import {
  isValidNanoid,
  isValidObjectId,
  isValidDateFormat,
  isFutureDate,
} from '@/config/validators/commonConfig';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
import {
  EventFormationStatus as FORMATION_STATUS,
  EventRegistrationStatus as REGISTRATION_STATUS,
  SortBy,
  SortOrder,
} from '@/enums/EventStatus';
import { DefaultQuery } from '@/enums/EventRequest';
type ValidationConfig = {
  [key: string]: ValidationChain[];
};
const validateEventTimesOrder: CustomValidator = (value, { req }) => {
  const {
    eventStartTime,
    eventEndTime,
    registrationStartTime,
    registrationEndTime,
  } = req.body;

  if (dayjs(registrationStartTime).isAfter(dayjs(registrationEndTime))) {
    throw new Error('註冊開始時間不能晚於註冊結束時間哦！');
  }
  if (dayjs(eventStartTime).isAfter(dayjs(eventEndTime))) {
    throw new Error('活動開始時間不能晚於活動結束時間哦！');
  }
  if (dayjs(registrationEndTime).isAfter(dayjs(eventStartTime))) {
    throw new Error('註冊結束時間不能晚於活動開始時間哦！');
  }

  return true;
};

export const validationConfig: {
  body: ValidationConfig;
  query: ValidationConfig;
  param: ValidationConfig;
} = {
  body: {
    storeId: [
      body('storeId')
        .optional()
        .custom(isValidObjectId)
        .withMessage('商店ID格式不對哦！'),
    ],
    title: [
      body('title')
        .notEmpty()
        .withMessage('標題不能為空哦！')
        .isString()
        .withMessage('標題必須是字串哦！'),
    ],
    description: [
      body('description')
        .notEmpty()
        .withMessage('描述不能為空哦！')
        .isString()
        .withMessage('描述必須是字串哦！'),
    ],
    eventStartTime: [
      body('eventStartTime')
        .notEmpty()
        .withMessage('活動開始時間不能為空哦！')
        .custom((value, { req, location, path }) =>
          isFutureDate(value, { req, location, path }),
        )
        .custom((value, { req, location, path }) =>
          isValidDateFormat(value, { req, location, path }),
        ),
    ],
    eventEndTime: [
      body('eventEndTime')
        .notEmpty()
        .withMessage('活動結束時間不能為空哦！')
        .custom((value, { req, location, path }) =>
          isValidDateFormat(value, { req, location, path }),
        )
        .custom((value, { req, location, path }) =>
          isFutureDate(value, { req, location, path }),
        ),
    ],
    registrationStartTime: [
      body('registrationStartTime')
        .notEmpty()
        .withMessage('註冊開始時間不能為空哦！')
        .custom((value, { req, location, path }) =>
          isValidDateFormat(value, { req, location, path }),
        ),
    ],
    registrationEndTime: [
      body('registrationEndTime')
        .notEmpty()
        .withMessage('註冊結束時間不能為空哦！')
        .custom((value, { req, location, path }) =>
          isValidDateFormat(value, { req, location, path }),
        )
        .custom((value, { req, location, path }) =>
          isFutureDate(value, { req, location, path }),
        )
        .custom(validateEventTimesOrder),
    ],
    address: [
      body('address')
        .notEmpty()
        .withMessage('地址不能為空哦！')
        .isString()
        .withMessage('地址必須是字串哦！'),
    ],
    isFoodAllowed: [
      body('isFoodAllowed')
        .notEmpty()
        .withMessage('是否允許食物不能為空哦！')
        .isBoolean()
        .withMessage('是否允許食物必須是布爾值哦！'),
    ],
    maxParticipants: [
      body('maxParticipants')
        .notEmpty()
        .withMessage('最大參與人數不能為空哦！')
        .isInt({ min: 1 })
        .withMessage('最大參與人數必須是一個正整數哦！'),
    ],
    minParticipants: [
      body('minParticipants')
        .notEmpty()
        .withMessage('最小參與人數不能為空哦！')
        .isInt({ min: 1 })
        .withMessage('最小參與人數必須是一個正整數哦！'),
      body('minParticipants').custom((value, { req }) => {
        if (value > req.body.maxParticipants) {
          throw new Error('最小參與人數不能大於最大參與人數哦！');
        }
        return true;
      }),
    ],
    participationFee: [
      body('participationFee')
        .notEmpty()
        .withMessage('參與費用不能為空哦！')
        .isInt({ min: 0 })
        .withMessage('參與費用必須是一個非負數哦！'),
    ],
    eventImageUrl: [
      body('eventImageUrl')
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
      query('limit')
        .optional()
        .isInt({ min: 1, max: Number(DefaultQuery.MAX_LIMIT) })
        .toInt()
        .withMessage('請輸入有效的最小參與人數！'),
    ],
    skip: [
      query('skip')
        .optional()
        .isInt({ min: 0 })
        .toInt()
        .withMessage('請輸入有效的跳過值！'),
    ],
    formationStatus: [
      query('formationStatus')
        .optional()
        .isIn(Object.values(FORMATION_STATUS))
        .toInt()
        .withMessage('請選擇有效的成團狀態！'),
    ],
    registrationStatus: [
      query('registrationStatus')
        .optional()
        .isIn(Object.values(REGISTRATION_STATUS))
        .toInt()
        .withMessage('請選擇有效的報名狀態！'),
    ],
    sortBy: [
      query('sortBy')
        .optional()
        .isIn(Object.values(SortBy))
        .withMessage('請選擇有效的排序欄位！'),
    ],
    sortOrder: [
      query('sortOrder')
        .optional()
        .isIn(Object.values(SortOrder))
        .withMessage('請選擇有效的排序順序！'),
    ],
  },
  param: {
    id: [
      param('id')
        .custom(isValidNanoid)
        .withMessage('請提供有效的 6位數Id 格式'),
    ],
    storeId: [
      param('storeId')
        .custom(isValidObjectId)
        .withMessage('請提供有效的 ObjectId 格式'),
    ],
  },
};
