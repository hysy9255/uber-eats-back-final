import { Injectable } from '@nestjs/common';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { RestaurantDetailDTO } from 'src/restaurant/ui/dtos/query/restaurant-detail.dto';
import { RestaurantSummaryDTO } from 'src/restaurant/ui/dtos/query/restaurant-summary.dto';
import { RestaurantReader } from '../ports/restaurant.reader';
import { DayOperatingHoursDTO } from 'src/restaurant/ui/dtos/query/day-operating-hours.dto';
import { RestaurantOverviewSummaryDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-summary.dto';
import { RestaurantOverviewRevenueDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-revenue.dto';
import { RestaurantOverviewLiveOrdersDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-live-order.dto';
import { RestaurantOverviewTopSellingItemDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-top-selling-item.dto';
import { RestaurantSettingDTO } from '../../ui/dtos/query/owner/restaurant-setting.dto';

@Injectable()
export class RestaurantQueryService {
  constructor(private readonly restaurantReader: RestaurantReader) {}

  async getRestaurants(): Promise<RestaurantSummaryDTO[]> {
    return await this.restaurantReader.findRestaurants();
  }

  async getRestaurant(
    restaurantId: RestaurantId,
  ): Promise<RestaurantDetailDTO> {
    return await this.restaurantReader.findRestaurant(restaurantId);
  }

  async getRestaurantSetting(
    restaurantId: RestaurantId,
  ): Promise<RestaurantSettingDTO> {
    return await this.restaurantReader.findRestaurantSetting(restaurantId);
  }

  async getRestaurantHours(
    restaurantId: RestaurantId,
  ): Promise<DayOperatingHoursDTO[]> {
    return await this.restaurantReader.findRestaurantHours(restaurantId);
  }

  async getRestaurantOverviewSummary(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewSummaryDTO> {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    return await this.restaurantReader.findRestaurantOverviewSummary(
      restaurantId,
      startDate,
      endDate,
    );
  }

  async getRestaurantOverviewRevenue(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewRevenueDTO> {
    return await this.restaurantReader.findRestaurantOverviewRevenue(
      restaurantId,
      startDate,
      endDate,
    );
  }

  async getRestaurantOverviewLiveOrders(
    restaurantId: RestaurantId,
  ): Promise<RestaurantOverviewLiveOrdersDTO> {
    return await this.restaurantReader.findRestaurantOverviewLiveOrders(
      restaurantId,
    );
  }

  async getRestaurantOverviewTopSellingItems(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewTopSellingItemDTO[]> {
    return await this.restaurantReader.findRestaurantOverviewTopSellingItems(
      restaurantId,
      startDate,
      endDate,
    );
  }
}
