import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { DayOperatingHoursDTO } from 'src/restaurant/ui/dtos/query/day-operating-hours.dto';
import { RestaurantOverviewLiveOrdersDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-live-order.dto';
import { RestaurantOverviewRevenueDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-revenue.dto';
import { RestaurantOverviewSummaryDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-summary.dto';
import { RestaurantOverviewTopSellingItemDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-top-selling-item.dto';
import { RestaurantDetailDTO } from 'src/restaurant/ui/dtos/query/restaurant-detail.dto';
import { RestaurantSummaryDTO } from 'src/restaurant/ui/dtos/query/restaurant-summary.dto';
import { RestaurantSettingDTO } from '../../ui/dtos/query/owner/restaurant-setting.dto';

export abstract class RestaurantReader {
  abstract findRestaurants(): Promise<RestaurantSummaryDTO[]>;
  abstract findRestaurant(
    restaurantId: RestaurantId,
  ): Promise<RestaurantDetailDTO>;

  abstract findRestaurantSetting(
    restaurantId: RestaurantId,
  ): Promise<RestaurantSettingDTO>;

  abstract findRestaurantHours(
    restaurantId: RestaurantId,
  ): Promise<DayOperatingHoursDTO[]>;

  abstract findRestaurantOverviewSummary(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewSummaryDTO>;

  abstract findRestaurantOverviewRevenue(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewRevenueDTO>;

  abstract findRestaurantOverviewLiveOrders(
    restaurantId: RestaurantId,
  ): Promise<RestaurantOverviewLiveOrdersDTO>;

  // abstract findRestaurantOverviewCustomerActivity(
  //   restaurantId: RestaurantId,
  // ): Promise<RestaurantOverviewCustomerActivityDTO>;

  abstract findRestaurantOverviewTopSellingItems(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewTopSellingItemDTO[]>;
}
