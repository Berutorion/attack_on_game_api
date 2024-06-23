"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrderDTO = void 0;
class UserOrderDTO {
    constructor(order) {
        this.idNumber = order.idNumber;
        this.registrationCount = order.registrationCount;
        this.payment = order.payment + order.discount;
        this.name = order.name;
        this.phone = order.phone;
        this.notes = order.notes;
        this.isCommented = order.isCommented;
        this.paymentStatus = order.paymentStatus;
        this.paymentMethod = order.paymentMethod;
    }
    toDetailDTO() {
        return this;
    }
}
exports.UserOrderDTO = UserOrderDTO;
//# sourceMappingURL=userOrderDTO.js.map