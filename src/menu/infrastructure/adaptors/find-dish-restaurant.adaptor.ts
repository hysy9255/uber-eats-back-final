import { InjectRepository } from '@nestjs/typeorm';
import { DishEntity } from '../entities/dish.enity';
import { In, Repository } from 'typeorm';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { FindDishRestaurant } from 'src/cart/application/ports/find-dish-restaurant';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export class FindDishRestaurantAdaptor extends FindDishRestaurant {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepo: Repository<DishEntity>,
  ) {
    super();
  }

  async findByDishId(
    dishId: DishId,
  ): Promise<{ restaurantId: RestaurantId } | null> {
    const dish = await this.dishRepo.findOne({
      where: { dishId: dishId.value },
      relations: { category: { restaurant: true } },
    });

    if (!dish) return null;

    return {
      restaurantId: new RestaurantId(dish.category.restaurant.restaurantId),
    };
  }

  async findRestaurantIdsByDishIds(dishIds: DishId[]) {
    const dishes = await this.dishRepo.find({
      where: {
        dishId: In(dishIds.map((id) => id.value)),
      },
      relations: {
        category: true,
      },
      select: {
        dishId: true,
        category: {
          categoryId: true,
          restaurantId: true,
        },
      },
    });

    return dishes.map((dish) => new RestaurantId(dish.category.restaurantId));
  }
}
