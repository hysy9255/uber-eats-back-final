import { ClientEntity } from 'src/client/infrastructure/entities/client.orm-entity';
import { OrderEntity } from 'src/order/infrastructure/entities/order.orm-entity';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingEntity } from './rating.orm-entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  reviewId: string;

  @Column()
  content: string;

  @Column()
  clientId: string;

  @Column()
  orderId: string;

  @Column()
  restaurantId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  postedAt: Date;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;

  @ManyToOne(() => ClientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: ClientEntity;

  @OneToOne(() => OrderEntity, (order) => order.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @OneToOne(() => RatingEntity, (rating) => rating.review)
  rating: RatingEntity;

  constructor(
    content: string,
    clientId: string,
    orderId: string,
    restaurantId: string,
  ) {
    this.content = content;
    this.clientId = clientId;
    this.orderId = orderId;
    this.restaurantId = restaurantId;
  }
}
