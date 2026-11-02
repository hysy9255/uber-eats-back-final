import { RestaurantStatusType } from 'src/restaurant/domain/restaurant/vo/restaurant-status';

export class RestaurantSummaryDTO {
  restaurantId: string;
  logo: string | null;
  name: string;
  address: string;
  status: RestaurantStatusType;
  mainImg: string;
  sub1Img: string;
  sub2Img: string;
  avgRating: number | null;
  reviewCount: number;

  constructor(
    restaurantId: string,
    logo: string | null,
    name: string,
    address: string,
    status: RestaurantStatusType,
    mainImg: string,
    sub1Img: string,
    sub2Img: string,
    avgRating: number | null,
    reviewCount: number,
  ) {
    this.restaurantId = restaurantId;
    this.logo = logo;
    this.name = name;
    this.address = address;
    this.status = status;
    this.mainImg = mainImg;
    this.sub1Img = sub1Img;
    this.sub2Img = sub2Img;
    this.avgRating = avgRating;
    this.reviewCount = reviewCount;
  }
}
