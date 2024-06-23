"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidator = void 0;
const eventConfig_1 = require("@/config/validators/eventConfig");
class EventValidator {
    static validateEvent() {
        return Object.values(eventConfig_1.validationConfig.body).flat();
    }
    static validateEventQuery() {
        return Object.values(eventConfig_1.validationConfig.query).flat();
    }
    static validateEventParam(parameters) {
        return eventConfig_1.validationConfig.param[parameters];
    }
}
exports.EventValidator = EventValidator;
//# sourceMappingURL=eventValidator.js.map