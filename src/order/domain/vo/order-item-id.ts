import { v4 as uuidv4 } from 'uuid';

export class OrderItemId {
  constructor(readonly value: string) {}

  static generate() {
    return new OrderItemId(uuidv4());
  }
}
