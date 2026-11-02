import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/auth/application/ports/find-user';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { RestaurantOwnershipGuard } from 'src/authorization/restaurant-ownership/ui/restaurant-ownership.guard';
import { RestaurantQueryService } from 'src/restaurant/application/services/restaurant.query.service';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { RestaurantOverviewSummaryDTO } from '../dtos/query/owner/restaurant-overview-summary.dto';
import { RestaurantOverviewRevenueDTO } from '../dtos/query/owner/restaurant-overview-revenue.dto';
import { RestaurantOverviewLiveOrdersDTO } from '../dtos/query/owner/restaurant-overview-live-order.dto';
import { RestaurantOverviewTopSellingItemDTO } from '../dtos/query/owner/restaurant-overview-top-selling-item.dto';
import { RestaurantSettingDTO } from '../dtos/query/owner/restaurant-setting.dto';

@Controller('owner/restaurants/:restaurantId')
@Roles(UserRole.Owner)
@UseGuards(RestaurantOwnershipGuard)
export class OwnerRestaurantQueryController {
  constructor(
    private readonly restaurantQueryService: RestaurantQueryService,
  ) {}

  @Get('/overview/summary')
  async getRestaurantOverviewSummary(
    @Param('restaurantId') restaurantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<RestaurantOverviewSummaryDTO> {
    return await this.restaurantQueryService.getRestaurantOverviewSummary(
      new RestaurantId(restaurantId),
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/overview/revenue')
  async getRestaurantOverviewRevenue(
    @Param('restaurantId') restaurantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<RestaurantOverviewRevenueDTO> {
    return await this.restaurantQueryService.getRestaurantOverviewRevenue(
      new RestaurantId(restaurantId),
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/overview/live-orders')
  async getRestaurantOverviewLiveOrders(
    @Param('restaurantId') restaurantId: string,
  ): Promise<RestaurantOverviewLiveOrdersDTO> {
    return await this.restaurantQueryService.getRestaurantOverviewLiveOrders(
      new RestaurantId(restaurantId),
    );
  }

  // @Get('/overview/customer-activity')
  // async getRestaurantOverviewCustomerActivity(
  //   @Param('restaurantId') restaurantId: string,
  // ): Promise<RestaurantOverviewCustomerActivityDTO> {
  //   return await this.restaurantQueryService.getRestaurantOverviewCustomerActivity(
  //     new RestaurantId(restaurantId),
  //   );
  // }

  @Get('/overview/top-selling-items')
  async getRestaurantOverviewTopSellingItems(
    @Param('restaurantId') restaurantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<RestaurantOverviewTopSellingItemDTO[]> {
    return await this.restaurantQueryService.getRestaurantOverviewTopSellingItems(
      new RestaurantId(restaurantId),
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/settings')
  @Roles(UserRole.Owner)
  async getRestaurantSettings(
    @Param('restaurantId') restaurantId: string,
  ): Promise<RestaurantSettingDTO> {
    return await this.restaurantQueryService.getRestaurantSetting(
      new RestaurantId(restaurantId),
    );
  }
}
