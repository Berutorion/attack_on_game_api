import { BaseDTO } from './baseDTO';
import { ReviewDocument } from '@/interfaces/Review';
import { Types } from 'mongoose';

export class ReviewDTO extends BaseDTO {
  private readonly _storeId!: Types.ObjectId;
  private rate!: number;
  private content!: ReviewDocument['content'];

  constructor(dto: ReviewDocument) {
    super({
      _id: dto._id!,
      idNumber: dto.idNumber!,
      createdAt: dto.createdAt!,
      updatedAt: dto.updatedAt!,
    });
    this._storeId = dto.storeId!;
    this.rate = dto.rate!;
  }

  public toDetailDTO(): Partial<ReviewDocument> {
    return {
      idNumber: this.idNumber,
      storeId: this._storeId,
      rate: this.rate,
      content: this.content,
    };
  }
}
