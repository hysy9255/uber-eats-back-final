import { OwnerEntity } from 'src/owner/infrastructure/entities/owner.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { RestaurantHoursEntity } from './restaurant-hours.orm.entity';
import { RestaurantProfileEntity } from './restaurant-profile.orm-entity';
import { RestaurantAddressEntity } from './restaurant-address.orm.entity';
import { RestaurantGalleryEntity } from './restaurant-image.orm.entity';
import { RestaurantStatusType } from 'src/restaurant/domain/restaurant/vo/restaurant-status';
import { CategoryEntity } from 'src/menu/infrastructure/entities/category.entity';
import { OrderEntity } from 'src/order/infrastructure/entities/order.orm-entity';
import { ReviewEntity } from 'src/review/infrastructure/entities/review.orm-entity';
import { RatingEntity } from 'src/review/infrastructure/entities/rating.orm-entity';

@Entity('restaurants')
export class RestaurantEntity {
  @PrimaryColumn({ unique: true })
  restaurantId: string;

  @Column({ unique: true })
  ownerId: string;

  @Column({ type: 'enum', enum: RestaurantStatusType })
  status: RestaurantStatusType;

  @OneToOne(() => OwnerEntity, (owner) => owner.restaurant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: OwnerEntity;

  @OneToMany(() => RestaurantHoursEntity, (hours) => hours.restaurant)
  hours: RestaurantHoursEntity[];

  @OneToOne(() => RestaurantProfileEntity, (profile) => profile.restaurant)
  profile: RestaurantProfileEntity;

  @OneToOne(() => RestaurantAddressEntity, (address) => address.restaurant)
  address: RestaurantAddressEntity;

  @OneToOne(() => RestaurantGalleryEntity, (gallery) => gallery.restaurant)
  gallery: RestaurantGalleryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.restaurant)
  categories: CategoryEntity[];

  @OneToMany(() => OrderEntity, (order) => order.restaurant)
  orders: OrderEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.restaurant)
  reviews: ReviewEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.restaurant)
  ratings: RatingEntity[];

  constructor(
    restaurantId: string,
    ownerId: string,
    status: RestaurantStatusType,
  ) {
    this.restaurantId = restaurantId;
    this.ownerId = ownerId;
    this.status = status;
  }
}
