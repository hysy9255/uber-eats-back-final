import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/auth/ui/guards/auth.guard';
import { RestaurantSummaryDTO } from '../dtos/query/restaurant-summary.dto';
import { RestaurantQueryService } from '../../application/services/restaurant.query.service';
import { RestaurantId } from '../../domain/restaurant/vo/restaurant-id';
import { RestaurantDetailDTO } from '../dtos/query/restaurant-detail.dto';
import { DayOperatingHoursDTO } from '../dtos/query/day-operating-hours.dto';

@Controller('restaurants')
@Public()
export class RestaurantQueryController {
  constructor(private readonly restaurantQuery: RestaurantQueryService) {}

  @Get()
  async getRestaurants(): Promise<RestaurantSummaryDTO[]> {
    return await this.restaurantQuery.getRestaurants();
  }

  @Get('/:restaurantId')
  async getRestaurant(
    @Param('restaurantId') restaurantId: string,
  ): Promise<RestaurantDetailDTO> {
    return await this.restaurantQuery.getRestaurant(
      new RestaurantId(restaurantId),
    );
  }

  @Get('/:restaurantId/hours')
  async getRestaurantHours(
    @Param('restaurantId') restaurantId: string,
  ): Promise<DayOperatingHoursDTO[]> {
    return await this.restaurantQuery.getRestaurantHours(
      new RestaurantId(restaurantId),
    );
  }
}
