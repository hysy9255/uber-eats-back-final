import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReviewEntity } from './review.orm-entity';

@Entity('ratings')
export class RatingEntity {
  @PrimaryGeneratedColumn('uuid')
  ratingId: string;

  @Column()
  rating: number;

  @Column()
  restaurantId: string;

  @Column()
  reviewId: string;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;

  @OneToOne(() => ReviewEntity, (review) => review.rating, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reviewId' })
  review: ReviewEntity;

  constructor(rating: number, restaurantId: string, reviewId: string) {
    this.rating = rating;
    this.restaurantId = restaurantId;
    this.reviewId = reviewId;
  }
}
