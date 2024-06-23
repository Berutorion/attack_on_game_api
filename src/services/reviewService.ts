import { ReviewDTO } from '@/dto/reviewDTO';
import { IBaseService } from './IBaseService';
import { ReviewRepository } from '@/repositories/reviewRepository';
import { ReviewDocument } from '@/interfaces/Review';
import _ from 'lodash';

export class ReviewService implements IBaseService<ReviewDTO> {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  getById(id: string): Promise<Partial<ReviewDTO>> {
    throw new Error('Method not implemented.');
  }
  getAll(storeId: string): Promise<Partial<ReviewDTO>[]> {
    if (_.isEmpty(storeId)) {
      throw new Error('No storeId provided');
    }
    return this.reviewRepository.findAll({ storeId: storeId });
  }
  create(content: any): Promise<boolean> {
    return this.reviewRepository.create(content, content.userId);
  }
  update(id: string, content: any): Promise<Partial<ReviewDTO> | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<Partial<ReviewDTO> | null> {
    throw new Error('Method not implemented.');
  }
}
