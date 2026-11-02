export class CartItemDTO {
  dishId: string;
  dishImg: string | null;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  lineTotalPrice: number;

  constructor(
    dishId: string,
    dishImg: string | null,
    name: string,
    description: string,
    unitPrice: number,
    quantity: number,
  ) {
    this.dishId = dishId;
    this.dishImg = dishImg;
    this.name = name;
    this.description = description;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
    this.lineTotalPrice = Number((unitPrice * quantity).toFixed(2));
  }
}

export class RestaurantInfoDTO {
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string | null;
  constructor(
    restaurantId: string,
    restaurantName: string,
    restaurantLogo: string | null,
  ) {
    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
    this.restaurantLogo = restaurantLogo;
  }
}

export class CartDTO {
  restaurantInfo: RestaurantInfoDTO | null;
  items: CartItemDTO[];
  totalCost: number;

  constructor(restaurantInfo: RestaurantInfoDTO | null, items: CartItemDTO[]) {
    this.restaurantInfo = restaurantInfo;
    this.items = items;
    this.totalCost = Number(
      items.reduce((total, item) => total + item.lineTotalPrice, 0).toFixed(2),
    );
  }
}
