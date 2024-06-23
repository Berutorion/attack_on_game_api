"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderListDTO = void 0;
class OrderListDTO {
    constructor(order, event) {
        this.idNumber = order.idNumber;
        this.title = event.title;
        this.eventStartTime = event.eventStartTime;
        this.eventEndTime = event.eventEndTime;
        this.eventImageUrl = event.eventImageUrl;
        this.totalAmount = order.payment + order.discount;
        this.registrationCount = order.registrationCount;
        this.notes = order.notes;
        this.paymentStatus = order.paymentStatus;
        this.paymentMethod = order.paymentMethod;
        this.isCommented = order.isCommented; // 假設 order 有 isCommented 屬性
        this.status = order.status;
    }
    toDetailDTO() {
        return this;
    }
}
exports.OrderListDTO = OrderListDTO;
//# sourceMappingURL=orderListDTO.js.map