import { ReviewDocument, ContentObject } from '@/interfaces/Review';
import { IBaseRepository } from './IBaseRepository';
import { ReviewModel } from '@/models/Review';
import _ from 'lodash';
import { CustomError } from '@/errors/CustomError';
import { CustomResponseType } from '@/enums/CustomResponseType';
import { MONGODB_ERROR_MSG } from '@/types/OtherResponseType';
import Order from '@/models/OrderModel';
import Event from '@/models/EventModel';
import { getUser } from '@/utils/help';

type ReviewContentRequest = {
  rate: number;
  orderNumber: string;
  content: string;
};
export class ReviewRepository {
  async findById(id: string): Promise<ReviewDocument> {
    throw new Error('Method not implemented.');
  }
  async findAll(queryParams: any): Promise<ReviewDocument[]> {
    try {
      const reviews = await ReviewModel.find(queryParams);
      if (_.isEmpty(reviews)) {
        throw new Error('No reviews found');
      }
      return reviews;
    } catch (error: any) {
      throw new CustomError(
        CustomResponseType.DATABASE_OPERATION_FAILED,
        `${MONGODB_ERROR_MSG}:${error.message || error}`,
      );
    }
  }
  async create(
    contentObj: ReviewContentRequest,
    userId: string,
  ): Promise<boolean> {
    try {
      const { orderNumber, content, rate } = contentObj;

      // use order number to get store id
      const order = await Order.findOne(
        { idNumber: orderNumber },
        'eventId -_id',
      );
      if (!order) {
        throw new CustomError(
          CustomResponseType.DATABASE_OPERATION_FAILED,
          `訂單編號錯誤`,
        );
      }
      const event = await Event.findById(order?.eventId).select('storeId');
      if (!event) {
        throw new CustomError(
          CustomResponseType.DATABASE_OPERATION_FAILED,
          `Order not found`,
        );
      }
      const storeId = event?.storeId;

      // use store id to check if review exists
      const reviewExists = await ReviewModel.findOne({ storeId });
      // create content object
      const newContent: ContentObject = {
        rate,
        author: userId,
        orderNo: orderNumber,
        content: content,
      };
      if (reviewExists) {
        // refresh store rating
        const newRating =
          (_.reduce(
            reviewExists.content,
            (sum, review) => sum + review.rate,
            0,
          ) +
            rate) /
          (reviewExists.content.length + 1);

        // add content to existing review array
        reviewExists.content.push(newContent);
        reviewExists.rate = newRating;
        await reviewExists.save();

        return true;
      } else {
        // create new review
        await ReviewModel.create({
          storeId: storeId,
          rate,
          content: [newContent],
        });
      }

      return true;
    } catch (error: any) {
      throw new CustomError(
        CustomResponseType.DATABASE_OPERATION_FAILED,
        `${MONGODB_ERROR_MSG}:${error.message || error}`,
      );
    }
  }
  async update(content: ReviewDocument): Promise<ReviewDocument | null> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<ReviewDocument> {
    throw new Error('Method not implemented.');
  }
}
