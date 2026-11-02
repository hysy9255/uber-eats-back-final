import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantId } from '../../domain/restaurant/vo/restaurant-id';
import { RestaurantRepository } from '../ports/restaurant.repository';
import { RestaurantGateway } from '../../ui/gateways/restaurant.gateway';

@Injectable()
export class RestaurantOperation {
  constructor(
    private readonly restaurantRepo: RestaurantRepository,
    private readonly restaurantGateway: RestaurantGateway,
  ) {}

  async open(restaurantId: RestaurantId) {
    const restaurant = await this.findRestaurant(restaurantId);
    restaurant.open();
    await this.restaurantRepo.save(restaurant);
    this.restaurantGateway.emitRestaurantStatusChanged(
      restaurantId.value,
      restaurant.status.value,
    );
  }

  async pauseOrders(restaurantId: RestaurantId) {
    const restaurant = await this.findRestaurant(restaurantId);
    restaurant.pauseOrders();
    await this.restaurantRepo.save(restaurant);
    this.restaurantGateway.emitRestaurantStatusChanged(
      restaurantId.value,
      restaurant.status.value,
    );
  }

  async close(restaurantId: RestaurantId) {
    const restaurant = await this.findRestaurant(restaurantId);
    restaurant.close();
    await this.restaurantRepo.save(restaurant);
    this.restaurantGateway.emitRestaurantStatusChanged(
      restaurantId.value,
      restaurant.status.value,
    );
  }

  async resume(restaurantId: RestaurantId) {
    const restaurant = await this.findRestaurant(restaurantId);
    restaurant.resumeOrders();
    await this.restaurantRepo.save(restaurant);
    this.restaurantGateway.emitRestaurantStatusChanged(
      restaurantId.value,
      restaurant.status.value,
    );
  }

  private async findRestaurant(restaurantId: RestaurantId) {
    const restaurant = await this.restaurantRepo.findById(restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant Not Found');
    return restaurant;
  }
}
