//TODO:上傳照片的方式可能也要研究一下
//TODO:寫一個fs模塊，批量上傳假資料
import _ from 'lodash';
import { Request } from 'express';
import { EventDTO } from '@/dto/eventDTO';
import { EventRepository } from '@/repositories/EventRepository';
import { QueryParamsParser } from '@/services/eventQueryParams';
import { CustomResponseType } from '@/enums/CustomResponseType';
import { CustomError } from '@/errors/CustomError';
import { IBaseService } from '@/services/IBaseService';
import { EventResponseType } from '@/types/EventResponseType';
import { EventDocument } from '@/interfaces/EventInterface';
import { Types } from 'mongoose';
export class EventService implements IBaseService<EventDTO> {
  private EventRepository: EventRepository;
  private queryParams: QueryParamsParser;
  constructor() {
    this.EventRepository = new EventRepository();
    this.queryParams = new QueryParamsParser();
  }
  async getById(id: string): Promise<Partial<EventDTO>> {
    const event = await this.EventRepository.findById(id);
    const eventDTO = new EventDTO(event);
    if (!eventDTO.isPublish) {
      throw new CustomError(
        CustomResponseType.UNAUTHORIZED,
        EventResponseType.FAILED_AUTHORIZATION,
      );
    }
    return eventDTO.toDetailDTO();
  }
  async getAll(queryParams: any): Promise<Partial<EventDTO>[]> {
    const _queryParams = this.queryParams.parse(queryParams);
    const eventData = await this.EventRepository.findAll(_queryParams);
    if (_.isEmpty(eventData)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        EventResponseType.FAILED_FOUND,
      );
    }
    return _.map(eventData, (event) => new EventDTO(event).toDetailDTO());
  }
  async create(content: EventDocument): Promise<boolean> {
    const _content = new EventDTO(content).toDetailDTO();
    return await this.EventRepository.create(_content);
  }
  async update(
    id: string,
    content: EventDocument,
  ): Promise<Partial<EventDTO> | null> {
    const updateContent = { ...content, idNumber: id };
    const _content = new EventDTO(updateContent);
    const _event = await this.EventRepository.update(_content);
    if (!_.isEmpty(_event)) {
      const _eventDTO = new EventDTO(_event);
      return _eventDTO.toDetailDTO();
    }
    throw new CustomError(
      CustomResponseType.NOT_FOUND,
      EventResponseType.FAILED_FOUND,
    );
  }
  delete(id: string): Promise<EventDTO | null> {
    throw new Error('Method not implemented.');
  }
  public async getEventsForStore(
    storeId: Types.ObjectId,
    optionsReq: Request,
  ): Promise<Partial<EventDTO>[]> {
    const queryParams = this.queryParams.parse(optionsReq);
    const eventData = await this.EventRepository.getEventsByStoreId(
      storeId,
      queryParams,
    );
    if (!_.isEmpty(eventData)) {
      const eventDTOs = _.map(eventData, (event) =>
        new EventDTO(event).toDetailDTO(),
      );
      return eventDTOs;
    }
    throw new CustomError(
      CustomResponseType.NOT_FOUND,
      EventResponseType.FAILED_FOUND,
    );
  }

  public async getSummaryEvents(id: string): Promise<Partial<EventDTO>> {
    const event = await this.EventRepository.findById(id);
    if (_.isEmpty(event)) {
      throw new CustomError(
        CustomResponseType.NOT_FOUND,
        EventResponseType.FAILED_FOUND,
      );
    }
    const _eventDTO = new EventDTO(event);
    if (_eventDTO.isPublish && _eventDTO.isRegisterable) {
      return _eventDTO.toSummaryDTO();
    }
    throw new CustomError(
      CustomResponseType.UNAUTHORIZED,
      EventResponseType.FAILED_AUTHORIZATION,
    );
  }
}
