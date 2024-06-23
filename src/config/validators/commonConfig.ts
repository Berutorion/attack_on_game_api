import { Types } from 'mongoose';
import { CustomValidator } from 'express-validator';
import dayjs from 'dayjs';

export const isValidObjectId: CustomValidator = (value: string) => {
  return Types.ObjectId.isValid(value);
};

export const isValidNanoid: CustomValidator = (value: string) => {
  const nanoidRegex = /^[a-z0-9]{8}$/;
  if (!nanoidRegex.test(value)) {
    throw new Error('Invalid ID format');
  }
  return true;
};

export const isValidDateFormat: CustomValidator = (value: string, { path }) => {
  if (!dayjs(value).isValid()) {
    throw new Error(`${path}時間格式不對哦！必須是有效日期`);
  }
  return true;
};

export const isFutureDate: CustomValidator = (value: string, { path }) => {
  const now = dayjs();
  if (dayjs(value).isAfter(now)) {
    return true;
  }
  throw new Error(`${path}時間格式不對哦！必須是未來的日期`);
};

export const isPastDate: CustomValidator = (value: string, { path }) => {
  const now = dayjs();
  if (dayjs(value).isBefore(now)) {
    return true;
  }
  throw new Error(`${path}時間格式不對哦！必須是今天以前的日期`);
};
