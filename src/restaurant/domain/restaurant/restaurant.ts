import { RestaurantId } from './vo/restaurant-id';
import { ConflictException } from '@nestjs/common';
import { RestaurantStatus, RestaurantStatusType } from './vo/restaurant-status';
import { OwnerId } from 'src/owner/domain/owner-id';

export class Restaurant {
  constructor(
    readonly id: RestaurantId,
    readonly ownerId: OwnerId,
    private _status: RestaurantStatus,
  ) {}

  get status() {
    return this._status;
  }

  canAcceptOrders() {
    if (this._status.value !== RestaurantStatusType.Open) {
      return false;
    } else {
      return true;
    }
  }

  close() {
    if (this._status.value === RestaurantStatusType.Closed)
      throw new ConflictException('Restaurant is already closed');
    this._status = new RestaurantStatus(RestaurantStatusType.Closed);
  }

  open() {
    if (this._status.value !== RestaurantStatusType.Closed)
      throw new ConflictException('Only Closed restaurant can open');
    this._status = new RestaurantStatus(RestaurantStatusType.Open);
  }

  pauseOrders() {
    if (this._status.value !== RestaurantStatusType.Open)
      throw new ConflictException('Only Open restaurant can pause orders');

    this._status = new RestaurantStatus(RestaurantStatusType.Paused);
  }

  resumeOrders() {
    if (this._status.value !== RestaurantStatusType.Paused)
      throw new ConflictException('Only Paused restaurant can resume orders');

    this._status = new RestaurantStatus(RestaurantStatusType.Open);
  }
}
