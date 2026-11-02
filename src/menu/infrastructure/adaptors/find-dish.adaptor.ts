import { InjectRepository } from '@nestjs/typeorm';
import { FindDish } from 'src/order/application/ports/find-dish';
import { DishEntity } from '../entities/dish.enity';
import { In, Repository } from 'typeorm';
import { Dish } from 'src/menu/domain/entities/dish';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishDescription } from 'src/menu/domain/value-objects/dish-description';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';

export class FindDishAdaptor extends FindDish {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepo: Repository<DishEntity>,
  ) {
    super();
  }

  async findByIds(dishIds: DishId[]): Promise<Dish[]> {
    const entities = await this.dishRepo.find({
      where: { dishId: In(dishIds.map((id) => id.value)) },
    });

    return entities.map(
      (entity) =>
        new Dish(
          new DishId(entity.dishId),
          new DishName(entity.name),
          new Price(entity.price),
          new DishDescription(entity.description),
          new DishImageUrl(entity.dishImgUrl),
        ),
    );
  }
}
