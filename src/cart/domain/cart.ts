import { ClientId } from 'src/client/domain/vo/client-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { CartItem } from './cart-item';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { Quantity } from 'src/order/domain/vo/quantity';

export class Cart {
  constructor(
    readonly clientId: ClientId,
    private _restaurantId: RestaurantId | null,
    private _cartItems: CartItem[],
  ) {
    this.ensureRestaurantAssignmentPolicy();
  }

  increaseQuantity(dishId: DishId) {
    const item = this._cartItems.find((item) => item.dishId.equals(dishId));
    if (!item) throw new Error('Item not found');
    item.increaseQauntity();
  }

  decreaseQuantity(dishId: DishId) {
    const item = this._cartItems.find((item) => item.dishId.equals(dishId));
    if (!item) throw new Error('Item not found');

    if (item.quantity.value === 1) {
      this.deleteItem(dishId);
      return;
    }

    item.decreaseQauntity();
  }

  private deleteItem(dishId: DishId) {
    this._cartItems = this._cartItems.filter(
      (item) => !item.dishId.equals(dishId),
    );
    if (this._cartItems.length === 0) {
      this.emptyCart();
    }
  }

  replaceItemsWithBulkItems(restaurantId: RestaurantId, items: CartItem[]) {
    if (this.isEmpty())
      throw new Error('Cannot replace items when cart is empty');

    if (this.restaurantId && this.restaurantId.equals(restaurantId)) {
      throw new Error(
        'Cannot replace cart items because the new items are from the same restaurant',
      );
    }

    this.emptyCart();
    this._restaurantId = restaurantId;
    this._cartItems = items;
  }

  replaceItems(restaurantId: RestaurantId, dishId: DishId, quantity: Quantity) {
    if (this.isEmpty())
      throw new Error('Cannot replace items when cart is empty');

    if (this.restaurantId && this.restaurantId.equals(restaurantId)) {
      throw new Error(
        'Cannot replace cart items because the new items are from the same restaurant',
      );
    }

    this.emptyCart();
    this.addItem(restaurantId, dishId, quantity);
  }

  emptyCart() {
    this._restaurantId = null;
    this._cartItems = [];
  }

  addItem(restaurantId: RestaurantId, dishId: DishId, quantity: Quantity) {
    if (this.isEmpty()) {
      this._restaurantId = restaurantId;
    } else {
      this.ensureSameRestaurant(restaurantId);
    }

    const existingItem = this._cartItems.find((item) =>
      item.dishId.equals(dishId),
    );

    if (existingItem) {
      existingItem.addQuantity(quantity);
      return;
    }

    this._cartItems.push(new CartItem(dishId, quantity));
  }

  private ensureSameRestaurant(restaurantId: RestaurantId) {
    if (!this._restaurantId!.equals(restaurantId)) {
      throw new Error(
        'Cannot add new items when different restaurant items are in the cart.',
      );
    }
  }

  private isEmpty(): boolean {
    return this._cartItems.length === 0;
  }

  getRestaurantIdOrThrow(): RestaurantId {
    if (this.isEmpty() || this._restaurantId === null) {
      throw new Error('Cart is empty');
    }

    return this._restaurantId;
  }

  get restaurantId() {
    return this._restaurantId;
  }

  get cartItems() {
    return this._cartItems;
  }

  private ensureRestaurantAssignmentPolicy() {
    const hasRestaurant = this._restaurantId !== null;
    const hasItems = this._cartItems.length > 0;

    if (hasRestaurant !== hasItems) {
      throw new Error(
        'Cart items and restaurant assignment must exist together',
      );
    }
  }
}
