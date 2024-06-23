import { OrderDocument } from '@/interfaces/OrderInterface';
export class UserOrderDTO {
  idNumber: string;
  registrationCount: number;
  payment: number;
  name: string;
  phone: string;
  notes: string;
  isCommented: boolean;
  paymentStatus: string;
  paymentMethod: string;

  constructor(order: OrderDocument) {
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
  public toDetailDTO(): UserOrderDTO {
    return this;
  }
}
