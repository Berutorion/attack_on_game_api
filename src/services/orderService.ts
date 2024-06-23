import _ from 'lodash';
import { IQuery } from '@/enums/OrderRequest';
import { Status } from '@/enums/OrderStatus';
import { OrderDocument } from '@/interfaces/OrderInterface';
import { EventDocument } from '@/interfaces/EventInterface';
import { TicketDocument } from '@/interfaces/TicketInterface';
import { IPlayer as PlayerDocument } from '@/models/Player';
import { OrderDTO } from '@/dto/orderDTO';
import { EventDTO } from '@/dto/eventDTO';
import { TicketDTO } from '@/dto/ticketDTO';
import { OrderRepository } from '@/repositories/orderRepository';
import { EventRepository } from '@/repositories/eventRepository';
import { TicketRepository } from '@/repositories/ticketRepository';
import { CustomResponseType } from '@/enums/CustomResponseType';
import { OrderResponseType } from '@/types/OrderResponseType';
import { EventResponseType } from '@/types/EventResponseType';
import { TicketResponseType } from '@/types/TicketResponseType';
import { CustomError } from '@/errors/CustomError';
import { Request } from 'express';
import Player from '@/models/Player';
import { Types } from 'mongoose';
import { createSesEncrypt, createShaEncrypt } from '@/utils/newEbPay';
import dayjs from 'dayjs';
interface IGetByIdResult {
  event: Partial<EventDocument>;
  order: Partial<OrderDocument>;
  tickets: Partial<TicketDocument>[];
}

export class OrderService {
  private orderRepository: OrderRepository;
  private eventRepository: EventRepository;
  private ticketRepository: TicketRepository;
  constructor() {
    this.orderRepository = new OrderRepository();
    this.eventRepository = new EventRepository();
    this.ticketRepository = new TicketRepository();
  }
  async getById(queryParams: Request): Promise<IGetByIdResult> {
    const player = await this.findPlayer(queryParams);
    const order = await this.findOrder(queryParams.params.orderId);
    const eventId = order.eventId;
    if (!eventId) {
      throw new CustomError(
        CustomResponseType.VALIDATION_ERROR,
        OrderResponseType.FAILED_VALIDATION_EVENT_ID,
      );
    }
    const event = await this.findEventByDbId(eventId);

    const targetOrderDTO = new OrderDTO(order);
    const targetEventDTO = new EventDTO(event);

    if (targetOrderDTO.status === Status.CANCEL) {
      return {
        event: targetEventDTO.toSummaryDTO(),
        order: targetOrderDTO.toDetailDTO(),
        tickets: [],
      };
    }

    const ticketList = await this.findTickets(order.id, player.user);
    const targetTicketsDTO = ticketList.map((ticket) =>
      new TicketDTO(ticket).toDetailDTO(),
    );

    return {
      event: targetEventDTO.toSummaryDTO(),
      order: targetOrderDTO.toDetailDTO(),
      tickets: targetTicketsDTO,
    };
  }
  async getAll(queryParams: Request): Promise<Partial<OrderDTO>[]> {
    const player = await this.findPlayer(queryParams);
    const { limit, status, skip } = queryParams.query as IQuery;
    const orderList = await this.findOrderList(player.user, {
      limit,
      status,
      skip,
    });
    return orderList.map((x) => x.toDetailDTO());
  }
  async create(queryParams: Request): Promise<{
    MerchantID: string | undefined;
    TradeInfo: string;
    TradeSha: string;
    Version: string | undefined;
  } | undefined> {
    const player = await this.findPlayer(queryParams);
    const targetEvent = await this.findEventById(queryParams.body.eventId);
    const targetOrderDTO = this.createOrderDTO(
      queryParams.body,
      targetEvent,
      player,
    );

    this.validateOrder(targetEvent, targetOrderDTO);

    const OrderDocument = await this.createOrder(targetOrderDTO);
    await this.updateEventParticipants(targetEvent, targetOrderDTO);

    try {
      const aesEncrypt = createSesEncrypt({
        MerchantOrderNo: OrderDocument.idNumber,
        TimeStamp: dayjs(OrderDocument.createdAt).unix(),
        Amt: OrderDocument.payment,
        ItemDesc: targetEvent.title!,

      });
      const shaEncrypt = createShaEncrypt(aesEncrypt);

      console.log(aesEncrypt, shaEncrypt);
      return {
        MerchantID: process.env.MerchantID!,
        TradeInfo: aesEncrypt,
        TradeSha: shaEncrypt,
        Version: process.env.Version!,
      };
    } catch (error) {
      console.log(error);
    }


    // await this.createTickets(
    //   OrderDocument.id,
    //   player.user,
    //   targetOrderDTO.registrationCount,
    // );


  }
  private async findPlayer(queryParams: Request): Promise<PlayerDocument> {
    const player = await Player.findOne({ user: queryParams.user });
    if (_.isEmpty(player)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.ERROR_PLAYER_FOUND,
      );
    }
    return player;
  }
  private async findOrder(orderId: string): Promise<OrderDocument> {
    const order = await this.orderRepository.findById(orderId);
    if (_.isEmpty(order)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        OrderResponseType.FAILED_FOUND,
      );
    }
    return order;
  }
  private async findOrderList(
    playerId: Types.ObjectId,
    query: IQuery,
  ): Promise<OrderDTO[]> {
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
    return order.map((order) => new OrderDTO(order));
  }

  private async findEventByDbId(
    eventId: Types.ObjectId,
  ): Promise<Partial<EventDocument>> {
    const event = await this.eventRepository.findByDBId(eventId);
    if (_.isEmpty(event)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        EventResponseType.FAILED_FOUND,
      );
    }
    return event;
  }
  private async findEventById(
    eventId: string,
  ): Promise<Partial<EventDocument>> {
    const event = await this.eventRepository.findById(eventId);
    if (_.isEmpty(event)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        EventResponseType.FAILED_FOUND,
      );
    }
    return event;
  }
  private async findTickets(
    orderId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<TicketDocument[]> {
    const ticketList = await this.ticketRepository.findAll(orderId, userId);
    if (_.isEmpty(ticketList)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        TicketResponseType.FAILED_FOUND,
      );
    }
    return ticketList;
  }
  private createOrderDTO(
    body: any,
    event: Partial<EventDocument>,
    player: PlayerDocument,
  ): OrderDTO {
    return new OrderDTO({
      ...body,
      eventId: event._id,
      playerId: player.user,
    });
  }
  private validateOrder(
    event: Partial<EventDocument>,
    orderDTO: OrderDTO,
  ): void {
    const targetEventDTO = new EventDTO(event);
    if (!targetEventDTO.isRegisterable) {
      throw new CustomError(
        CustomResponseType.VALIDATION_ERROR,
        OrderResponseType.CREATED_ERROR_REGISTRATION_PERIOD,
      );
    }
    if (
      targetEventDTO.participationFee * orderDTO.registrationCount !==
      orderDTO.getTotalAmount
    ) {
      throw new CustomError(
        CustomResponseType.VALIDATION_ERROR,
        OrderResponseType.CREATED_ERROR_MONEY,
      );
    }
    if (targetEventDTO.availableSeat < orderDTO.registrationCount) {
      throw new CustomError(
        CustomResponseType.VALIDATION_ERROR,
        OrderResponseType.CREATED_ERROR_EXCEEDS_CAPACITY,
      );
    }
  }
  private async createOrder(orderDTO: OrderDTO): Promise<OrderDocument> {
    return await this.orderRepository.create(orderDTO.toDetailDTO());
  }
  private async updateEventParticipants(
    event: Partial<EventDocument>,
    orderDTO: OrderDTO,
  ): Promise<void> {
    const targetEventDTO = new EventDTO(event);
    const addedSeat =
      targetEventDTO.currentParticipantsCount + orderDTO.registrationCount;
    await this.eventRepository.updateParticipantsCount(
      targetEventDTO,
      addedSeat,
    );
  }
  private async createTickets(
    orderId: Types.ObjectId,
    userId: Types.ObjectId,
    registrationCount: number,
  ): Promise<void> {
    const ticketPromises = [];
    for (let index = 0; index < registrationCount; index++) {
      ticketPromises.push(this.ticketRepository.create(orderId, userId));
    }
    await Promise.all(ticketPromises);
  }
}
