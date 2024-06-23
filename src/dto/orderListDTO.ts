import { PaymentStatus, PaymentMethod, Status } from '@/enums/OrderStatus';
import { EventDocument } from '@/interfaces/EventInterface';
import { OrderDocument } from '@/interfaces/OrderInterface';
export class OrderListDTO {
  readonly idNumber!: string;
  readonly title!: string;
  readonly eventStartTime!: string;
  readonly eventEndTime!: string;
  readonly eventImageUrl!: string[];
  readonly totalAmount: number;
  readonly registrationCount: number;
  readonly notes: string;
  readonly paymentStatus: PaymentStatus;
  readonly paymentMethod: PaymentMethod;
  readonly isCommented: boolean;
  readonly status: Status;
  constructor(order: OrderDocument, event: EventDocument) {
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

  public toDetailDTO(): OrderListDTO {
    return this;
  }
}
