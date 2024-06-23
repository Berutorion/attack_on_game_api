import { MyEventService } from '@/services/myEventService';
import { BaseController } from '@/controllers/baseController';
import { ResponseDTO } from '@/dto/responseDTO';
import { ResponseType } from '@/types/myEventResponseType';
import { Request } from 'express';
import { IBaseController } from '@/controllers/IBaseController';

export class MyEventController
  extends BaseController
  implements IBaseController
{
  private eventService: MyEventService;

  constructor() {
    super(ResponseType);
    this.eventService = new MyEventService();
  }
  public getById = async (req: Request): Promise<ResponseDTO> => {
    return this.handleServiceResponse(
      () => this.eventService.getOrderByEventId(req),
      ResponseType.SUCCESS_REQUEST,
    );
  };
  public getAll = async (req: Request): Promise<ResponseDTO> => {
    return await this.handleServiceResponse(
      () => this.eventService.getAllEventOrder(req),
      ResponseType.SUCCESS_REQUEST,
    );
  };
  // public deletUser = async (req: Request): Promise<ResponseDTO> => {
  //   return this.handleServiceResponse(
  //     () => this.eventService.deletUser(req),
  //     ResponseType.SUCCESS_UPDATE,
  //   );
  // };
  // public deletEvent = async (req: Request): Promise<ResponseDTO> => {
  //   return this.handleServiceResponse(
  //     () => this.eventService.deletEvent(req),
  //     ResponseType.SUCCESS_UPDATE,
  //   );
  // };
}
