export enum RestaurantStatusType {
  Open = 'open',
  Closed = 'closed',
  Paused = 'paused',
}

export class RestaurantStatus {
  constructor(readonly value: RestaurantStatusType) {}
}
