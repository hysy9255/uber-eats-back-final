export class DishAvailability {
  constructor(private readonly _value: boolean) {}

  get value() {
    return this._value;
  }
}
