import { BaseController } from './baseController';
import { ReviewService } from '../services/reviewService';
import { ReviewResponseType } from '@/types/ReviewResponseType';
import { Request } from 'express';
import { ResponseDTO } from '@/dto/responseDTO';
import { getUser } from '@/utils/help';

export class ReviewController extends BaseController {
  private reviewService: ReviewService;

  constructor() {
    super(ReviewResponseType);
    this.reviewService = new ReviewService();
  }

  public getAllReviews = (req: Request): Promise<ResponseDTO> => {
    return this.handleServiceResponse(
      () => this.reviewService.getAll(req.params.storeId),
      ReviewResponseType.SUCCESS_REQUEST,
    );
  };

  public createReview = (req: Request): Promise<ResponseDTO> => {
    const user = getUser(req);
    req.body.userId = user.id;
    const content = req.body;
    return this.handleServiceResponse(
      () => this.reviewService.create(content),
      ReviewResponseType.SUCCESS_REQUEST,
    );
  };
}
