import { InjectRepository } from '@nestjs/typeorm';
import { MenuRepository } from '../../application/ports/menu.repository';
import { Menu } from '../../domain/menu';
import { DishEntity } from '../entities/dish.enity';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { Injectable } from '@nestjs/common';
import { MenuOrmMapper } from '../mappers/menu.orm-mapper';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { CategoryId } from 'src/menu/domain/value-objects/category-id';
import { DishId } from 'src/menu/domain/value-objects/dish-id';

@Injectable()
export class MenuOrmRepository extends MenuRepository {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepo: Repository<DishEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {
    super();
  }

  async findByRestaurantId(restaurantId: RestaurantId): Promise<Menu> {
    const entities = await this.categoryRepo.find({
      where: { restaurantId: restaurantId.value },
      relations: { dishes: true },
    });

    return MenuOrmMapper.toDomain(restaurantId, entities);
  }

  async save(menu: Menu): Promise<void> {
    const [categoryEntities, dishEntities] = MenuOrmMapper.toEntities(menu);

    await this.categoryRepo.save(categoryEntities);
    await this.dishRepo.save(dishEntities);
  }

  async deleteCategory(categoryId: CategoryId): Promise<void> {
    await this.categoryRepo.delete(categoryId.value);
  }

  async deleteDish(dishId: DishId): Promise<void> {
    await this.dishRepo.delete(dishId.value);
  }
}
