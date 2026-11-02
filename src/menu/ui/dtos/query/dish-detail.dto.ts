export class ReviewDTO {
  content: string;
  userName: string;
  rating: number;
  postedAt: Date;

  constructor(
    content: string,
    userName: string,
    rating: number,
    postedAt: Date,
  ) {
    this.content = content;
    this.userName = userName;
    this.rating = rating;
    this.postedAt = postedAt;
  }
}

export class DishDetailDTO {
  restaurantName: string;
  logo: string | null;
  name: string;
  dishImg: string | null;
  description: string;
  price: number;
  avgRating: number | null;
  reviews: ReviewDTO[];

  constructor(
    restaurantName: string,
    logo: string | null,
    name: string,
    dishImg: string | null,
    description: string,
    price: number,
    avgRating: number | null,
    reviews: ReviewDTO[],
  ) {
    this.restaurantName = restaurantName;
    this.logo = logo;
    this.name = name;
    this.dishImg = dishImg;
    this.description = description;
    this.price = price;
    this.avgRating = avgRating;
    this.reviews = reviews;
  }
}
