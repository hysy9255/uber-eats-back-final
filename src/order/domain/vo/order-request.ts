export class OrderRequest {
  readonly toRestaurant: string | null;
  readonly toDriver: string | null;

  constructor(toRestaurant: string | null, toDriver: string | null) {
    this.toRestaurant = toRestaurant === null ? null : toRestaurant.trim();
    this.toDriver = toDriver === null ? null : toDriver.trim();
  }
}
