import { Request } from 'express';
import { ResponseDTO } from '@/dto/responseDTO';
export interface IBaseController {
  getById(req: Request): Promise<ResponseDTO>;
  getAll(req: Request): Promise<ResponseDTO>;
  create?(req: Request): Promise<ResponseDTO>;
  update?(req: Request): Promise<ResponseDTO>;
  delete?(req: Request): Promise<ResponseDTO>;
}
