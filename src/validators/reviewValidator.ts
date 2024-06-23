import { validationConfig } from '@/config/validators/reviewConfig';

export class ReviewValidator {
  static validateReview() {
    return Object.values(validationConfig.body).flat();
  }

  static validateReviewQuery() {
    return Object.values(validationConfig.query).flat();
  }

  static validateObjectIds(parameters: string) {
    return validationConfig.param[parameters];
  }
}
