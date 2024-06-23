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
  isPastDate,
} from '@/config/validators/commonConfig';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
import { DefaultQuery } from '@/enums/EventRequest';
type ValidationConfig = {
  [key: string]: ValidationChain[];
};
const validateEventTimesOrder: CustomValidator = (value, { req }) => {
  const { startTime, endTime } = req.query as {
    startTime: string;
    endTime: string;
  };

  if (dayjs(startTime).isAfter(dayjs(endTime))) {
    throw new Error('註冊開始時間不能晚於註冊結束時間哦！');
  }
};
export const validationConfig: {
  body: ValidationConfig;
  query: ValidationConfig;
  param: ValidationConfig;
} = {
  body: {
    playerId: [
      body('playerId')
        .custom(isValidObjectId)
        .withMessage('玩家ID格式不對哦！'),
    ],
    eventId: [
      body('eventId').custom(isValidNanoid).withMessage('活動ID格式不對哦！'),
    ],
  },
  query: {
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
    startTime: [query('startTime').optional()],
    endTime: [query('endTime').optional()],
  },
  param: {
    eventId: [
      param('eventId')
        .custom(isValidNanoid)
        .withMessage('請提供有效的 6位數Id 格式'),
    ],
  },
};
