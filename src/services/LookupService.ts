import _ from 'lodash';
import { Request } from 'express';
import { Types } from 'mongoose';
import Player from '@/models/Player';
import { IPlayer as PlayerDocument } from '@/models/Player';
import { IStore as StoreDocument } from '@/models/Store';
import { OrderRepository } from '@/repositories/OrderRepository';
import { EventRepository } from '@/repositories/EventRepository';
import { TicketRepository } from '@/repositories/TicketRepository';
import { CustomError } from '@/errors/CustomError';
import { CustomResponseType } from '@/enums/CustomResponseType';
import { OrderResponseType } from '@/types/OrderResponseType';
import { EventResponseType } from '@/types/EventResponseType';
import { TicketResponseType } from '@/types/TicketResponseType';
import { OrderDocument } from '@/interfaces/OrderInterface';
import { EventDocument } from '@/interfaces/EventInterface';
import { TicketDocument } from '@/interfaces/TicketInterface';
import { RequestWithUser } from '@/types/commonRequest';
import { IQuery } from '@/enums/OrderRequest';
import { Store } from '@/models/Store';
export class LookupService {
  constructor(
    private orderRepository: OrderRepository,
    private EventRepository: EventRepository,
    private ticketRepository: TicketRepository,
  ) {}
  public async findStore(queryParams: Request): Promise<StoreDocument> {
    const reqWithUser = queryParams as unknown as RequestWithUser;
    if (!reqWithUser.user) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.ERROR_PLAYER_FOUND,
      );
    }
    const store = await Store.findOne({ user: reqWithUser.user });
    if (_.isEmpty(store)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.ERROR_PLAYER_FOUND,
      );
    }
    return store;
  }

  public async findPlayer(queryParams: Request): Promise<PlayerDocument> {
    const reqWithUser = queryParams as unknown as RequestWithUser;
    if (!reqWithUser.user) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.ERROR_PLAYER_FOUND,
      );
    }
    const player = await Player.findOne({ user: reqWithUser.user });
    if (_.isEmpty(player)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.ERROR_PLAYER_FOUND,
      );
    }
    return player;
  }

  public async findOrder(orderId: string): Promise<OrderDocument> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.FAILED_FOUND,
      );
    }
    return order;
  }
  public async findOrderList(
    playerId: Types.ObjectId,
    query: IQuery,
  ): Promise<OrderDocument[]> {
    const queryObject: any = {
      playerId,
    };
    if (query.status) {
      queryObject.status = query.status;
    }
    const order = await this.orderRepository.findAll(queryObject, {
      limit: query.limit,
      skip: query.skip,
    });
    if (_.isEmpty(order)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.FAILED_FOUND,
      );
    }
    return order;
  }
  public async findEventById(eventId: string): Promise<Partial<EventDocument>> {
    const event = await this.EventRepository.findById(eventId);
    if (!event) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        EventResponseType.FAILED_FOUND,
      );
    }
    return event;
  }

  public async findEventByDbId(
    eventId: Types.ObjectId,
  ): Promise<Partial<EventDocument>> {
    const event = await this.EventRepository.findByDBId(eventId);
    if (!event) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        EventResponseType.FAILED_FOUND,
      );
    }
    return event;
  }

  public async findTickets(
    orderId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<TicketDocument[]> {
    const ticketList = await this.ticketRepository.findAll(orderId, userId);
    if (!ticketList.length) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        TicketResponseType.FAILED_FOUND,
      );
    }
    return ticketList;
  }
}
