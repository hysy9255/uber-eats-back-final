import { RestaurantStatusType } from 'src/restaurant/domain/restaurant/vo/restaurant-status';
import { DayOperatingHoursDTO } from './day-operating-hours.dto';

export class RestaurantDetailDTO {
  name: string;
  address: string;
  status: RestaurantStatusType;
  bannerImg: string;
  logo: string | null;
  avgRating: number | null;
  reviewCount: number;
  operatingHours: DayOperatingHoursDTO[];

  constructor(
    name: string,
    address: string,
    status: RestaurantStatusType,
    bannerImg: string,
    logo: string | null,
    avgRating: number | null,
    reviewCount: number,
    operatingHours: DayOperatingHoursDTO[],
  ) {
    this.name = name;
    this.address = address;
    this.status = status;
    this.bannerImg = bannerImg;
    this.logo = logo;
    this.avgRating = avgRating;
    this.reviewCount = reviewCount;
    this.operatingHours = operatingHours;
  }
}
