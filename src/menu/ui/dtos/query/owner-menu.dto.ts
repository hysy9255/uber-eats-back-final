export class OwnerMenuDTO {
  dishId: string;
  category: string;
  categoryId: string;
  name: string;
  price: number;
  dishImg: string | null;
  numOfSold: number;
  isAvailable: boolean;
  description: string;

  constructor(
    dishId: string,
    category: string,
    categoryId: string,
    name: string,
    price: number,
    dishImg: string | null,
    numOfSold: number,
    isAvailable: boolean,
    description: string,
  ) {
    this.dishId = dishId;
    this.category = category;
    this.categoryId = categoryId;
    this.name = name;
    this.price = price;
    this.dishImg = dishImg;
    this.numOfSold = numOfSold;
    this.isAvailable = isAvailable;
    this.description = description;
  }
}
