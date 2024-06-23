"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidator = void 0;
const myEventConfig_1 = require("@/config/validators/myEventConfig");
class EventValidator {
    static validateEventBody(parameters) {
        return myEventConfig_1.validationConfig.body[parameters];
    }
    static validateEventQuery() {
        return Object.values(myEventConfig_1.validationConfig.query).flat();
    }
    static validateEventParam() {
        return Object.values(myEventConfig_1.validationConfig.param).flat();
    }
}
exports.EventValidator = EventValidator;
//# sourceMappingURL=myEventValidator.js.map