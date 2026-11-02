import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RestaurantId } from '../../domain/restaurant/vo/restaurant-id';
import { RestaurantOperation } from '../../application/services/restaurant-operation';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { RestaurantOwnershipGuard } from 'src/authorization/restaurant-ownership/ui/restaurant-ownership.guard';

@Controller('restaurants/:restaurantId')
@Roles(UserRole.Owner)
@UseGuards(RestaurantOwnershipGuard)
export class RestaurantOperationController {
  constructor(private readonly restaurantOperation: RestaurantOperation) {}

  @Post('open')
  async open(@Param('restaurantId') restaurantId: string) {
    await this.restaurantOperation.open(new RestaurantId(restaurantId));
  }

  @Post('close')
  async close(@Param('restaurantId') restaurantId: string) {
    await this.restaurantOperation.close(new RestaurantId(restaurantId));
  }

  @Post('pause')
  async pause(@Param('restaurantId') restaurantId: string) {
    await this.restaurantOperation.pauseOrders(new RestaurantId(restaurantId));
  }

  @Post('resume')
  async resume(@Param('restaurantId') restaurantId: string) {
    await this.restaurantOperation.resume(new RestaurantId(restaurantId));
  }
}
