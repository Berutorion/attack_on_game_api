import { validationConfig } from '@/config/validators/eventConfig';
export class EventValidator {
  static validateEvent() {
    return Object.values(validationConfig.body).flat();
  }

  static validateEventQuery() {
    return Object.values(validationConfig.query).flat();
  }

  static validateEventParam(parameters: string) {
    return validationConfig.param[parameters];
  }
}
