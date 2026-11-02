export class MenuDTO {
  dishId: string;
  category: string;
  name: string;
  price: number;
  description: string;
  dishImg: string | null;
  numOfReviews: number;

  constructor(
    dishId: string,
    category: string,
    name: string,
    price: number,
    description: string,
    dishImg: string | null,
    numOfReviews: number,
  ) {
    this.dishId = dishId;
    this.category = category;
    this.name = name;
    this.price = price;
    this.description = description;
    this.dishImg = dishImg;
    this.numOfReviews = numOfReviews;
  }
}
