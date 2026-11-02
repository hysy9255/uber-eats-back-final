import { CategoryId } from 'src/menu/domain/value-objects/category-id';
import { Category } from '../../domain/entities/category';
import { Dish } from '../../domain/entities/dish';
import { Menu } from '../../domain/menu';
import { CategoryEntity } from '../entities/category.entity';
import { DishEntity } from '../entities/dish.enity';
import { CategoryName } from 'src/menu/domain/value-objects/category-name';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishDescription } from 'src/menu/domain/value-objects/dish-description';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { DishAvailability } from 'src/menu/domain/value-objects/dish-availability';

export class MenuOrmMapper {
  static toDomain(
    restaurantId: RestaurantId,
    categoryEntities: CategoryEntity[],
  ): Menu {
    const categories = categoryEntities.map((categoryEntity) => {
      const category = new Category(
        new CategoryId(categoryEntity.categoryId),
        new CategoryName(categoryEntity.name),
      );
      const dishes = categoryEntity.dishes.map(
        (dish) =>
          new Dish(
            new DishId(dish.dishId),
            new DishName(dish.name),
            new Price(dish.price),
            new DishDescription(dish.description),
            new DishImageUrl(dish.dishImgUrl),
            new DishAvailability(dish.availability),
          ),
      );
      category.addDishes(dishes);
      return category;
    });
    return new Menu(restaurantId, categories);
  }

  static toEntities(menu: Menu): [CategoryEntity[], DishEntity[]] {
    const categoryEntities = menu.categories.map((category) => {
      const categoryEntity = new CategoryEntity();
      categoryEntity.categoryId = category.id.value;
      categoryEntity.name = category.name.value;
      categoryEntity.restaurantId = menu.restaurantId.value;
      return categoryEntity;
    });

    const dishEntities = menu.categories.flatMap((category) => {
      return category.dishes.map((dish) => {
        const dishEntity = new DishEntity();
        dishEntity.dishId = dish.id.value;
        dishEntity.categoryId = category.id.value;
        dishEntity.name = dish.name.value;
        dishEntity.price = dish.price.value;
        dishEntity.description = dish.description.value;
        dishEntity.dishImgUrl = dish.dishImgUrl.value;
        dishEntity.availability = dish.availability.value;
        return dishEntity;
      });
    });
    return [categoryEntities, dishEntities];
  }
}
