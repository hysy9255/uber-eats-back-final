import { Address } from 'src/shared/infrastructure/entities/address/address';
import { RestaurantId } from '../restaurant/vo/restaurant-id';

export class RestaurantAddress {
  constructor(
    readonly restaurantId: RestaurantId,
    private _address: Address,
  ) {}

  get address() {
    return this._address;
  }

  update(newAddress: Address) {
    this._address = newAddress;
  }
}
