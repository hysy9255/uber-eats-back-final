import { v4 as uuidv4 } from 'uuid';

export class UserId {
  constructor(readonly value: string) {}

  static generate() {
    return new UserId(uuidv4());
  }
}
