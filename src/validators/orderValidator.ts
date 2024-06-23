import { validationConfig } from '@/config/validators/orderConfig';
export class OrderValidator {
  static validateOrder() {
    return Object.values(validationConfig.body).flat();
  }

  static validateOrderQuery() {
    return Object.values(validationConfig.query).flat();
  }

  static validateOrdertId() {
    return Object.values(validationConfig.param).flat();
  }
}
