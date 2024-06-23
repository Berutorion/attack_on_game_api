import OrderModel from '@/models/OrderModel';
import { IQuery, DefaultQuery } from '@/enums/OrderRequest';
import { Status } from '@/enums/OrderStatus';
import { OrderDocument } from '@/interfaces/OrderInterface';
import { CustomResponseType } from '@/enums/CustomResponseType';
import { CustomError } from '@/errors/CustomError';
import { IBaseRepository } from '@/repositories/IBaseRepository';
import { OrderResponseType } from '@/types/OrderResponseType';
import { MONGODB_ERROR_MSG } from '@/types/OtherResponseType';
import { Types } from 'mongoose';
import _ from 'lodash';
export class OrderRepository implements IBaseRepository<OrderDocument> {
  async findById(id: string): Promise<OrderDocument | null> {
    try {
      const order = await OrderModel.findOne({ idNumber: id });
      if (_.isEmpty(order)) {
        throw new CustomError(
          CustomResponseType.NOT_FOUND,
          OrderResponseType.FAILED_FOUND,
        );
      }
      return order;
    } catch (error: any) {
      throw new CustomError(
        CustomResponseType.DATABASE_OPERATION_FAILED,
        `${MONGODB_ERROR_MSG}:${error.message || error}`,
      );
    }
  }
  async findAllBuyers(eventId: Types.ObjectId): Promise<OrderDocument[]> {
    try {
      const orders = await OrderModel.find({ eventId: eventId });
      return orders;
    } catch (error: any) {
      throw new CustomError(
        CustomResponseType.DATABASE_OPERATION_FAILED,
        `${MONGODB_ERROR_MSG}:${error.message || error}`,
      );
    }
  }
  async findAll(
    queryParams: any,
    optionParams: IQuery,
  ): Promise<OrderDocument[]> {
    try {
      const parsedLimit = Math.min(
        Number(optionParams.limit ?? DefaultQuery.LIMIT),
        DefaultQuery.MAX_LIMIT,
      );
      const parsedSkip = Number(optionParams.skip ?? DefaultQuery.SKIP);
      const orders = await OrderModel.find({ ...queryParams })
        .skip(parsedSkip)
        .limit(parsedLimit);
      return orders;
    } catch (error: any) {
      throw new CustomError(
        CustomResponseType.DATABASE_OPERATION_FAILED,
        `${MONGODB_ERROR_MSG}:${error.message || error}`,
      );
    }
  }
  async create(content: Partial<OrderDocument>): Promise<OrderDocument> {
    try {
      const event = new OrderModel(content);
      await event.save();
      return event;
    } catch (error: any) {
      throw new CustomError(
        CustomResponseType.DATABASE_OPERATION_FAILED,
        `${MONGODB_ERROR_MSG}:${error.message || error}`,
      );
    }
  }
  async update(content: Partial<OrderDocument>): Promise<OrderDocument | null> {
    try {
      return await OrderModel.findOneAndUpdate(
        { _id: content.id },
        {
          payment: content.payment,
          discount: content.discount,
          name: content.name,
          phone: content.phone,
          registrationCount: content.registrationCount,
          notes: content.notes,
          paymentStatus: content.paymentStatus,
          paymentMethod: content.paymentMethod,
          updatedAt: content.updatedAt,
        },
        { new: true },
      ).exec();
    } catch (error: any) {
      throw new CustomError(
        CustomResponseType.DATABASE_OPERATION_FAILED,
        `${MONGODB_ERROR_MSG}:${error.message || error}`,
      );
    }
  }
  async delete(id: string): Promise<OrderDocument | null> {
    const order = await this.findById(id);
    if (!order) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.FAILED_FOUND,
      );
    }
    order.status = Status.CANCEL;
    const updatedOrder = await order.save();
    return updatedOrder;
  }
}
