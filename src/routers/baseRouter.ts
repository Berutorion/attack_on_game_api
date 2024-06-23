import { Router, Request, Response } from 'express';
import { ResponseDTO } from '@/dto/responseDTO';
import { CustomResponseType } from '@/enums/CustomResponseType';
import { SERVER_ERROR_MSG } from '@/types/OtherResponseType';
import _ from 'lodash';
export abstract class BaseRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;

  protected handleRequest(handler: (req: Request) => Promise<ResponseDTO>) {
    return async (req: Request, res: Response) => {
      try {
        const responseDTO = await handler(req);
        if (!_.isEmpty(responseDTO.data)) {
          res.status(this.mapStatusCode(responseDTO.status)).json(responseDTO);
        } else {
          res.status(this.mapStatusCode(responseDTO.status)).json({
            message: responseDTO.message,
            status: responseDTO.status,
          });
        }
      } catch (error) {
        res.status(500).json({
          status: CustomResponseType.SYSTEM_ERROR,
          message: `${SERVER_ERROR_MSG}:${error}`,
          data: error,
        });
      }
    };
  }
  private mapStatusCode(status: CustomResponseType): number {
    switch (status) {
      case CustomResponseType.SUCCESS:
      case CustomResponseType.CREATED:
        return 200;
      case CustomResponseType.BAD_REQUEST:
        return 400;
      case CustomResponseType.UNAUTHORIZED:
        return 401;
      case CustomResponseType.FORBIDDEN:
        return 403;
      case CustomResponseType.NOT_FOUND:
        return 404;
      case CustomResponseType.CONFLICT:
        return 409;
      case CustomResponseType.SYSTEM_ERROR:
      default:
        return 500;
    }
  }
}
