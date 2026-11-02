import { v4 as uuidv4 } from 'uuid';

export class OrderId {
  constructor(readonly value: string) {}

  static generate() {
    return new OrderId(uuidv4());
  }
}
