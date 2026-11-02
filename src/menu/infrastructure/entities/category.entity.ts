import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { DishEntity } from './dish.enity';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn()
  categoryId: string;

  @Column()
  restaurantId: string;

  @Column()
  name: string;

  @OneToMany(() => DishEntity, (dish) => dish.category)
  dishes: DishEntity[];

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;
}
