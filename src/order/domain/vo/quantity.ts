export class Quantity {
  constructor(readonly _value: number) {
    if (_value <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
  }

  get value() {
    return this._value;
  }
}
