import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { DeliveryAddressSnapEntity } from './delivery-address-snap.orm-entity';
import { OrderItemsEntity } from './order-items.orm-entity';
import { OrderStatusType } from 'src/order/domain/order-progress';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { ClientEntity } from 'src/client/infrastructure/entities/client.orm-entity';
import { ReviewEntity } from 'src/review/infrastructure/entities/review.orm-entity';
import { OrderRequestEntity } from './order-request.orm-entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn('uuid')
  orderId: string;

  @Column()
  clientId: string;

  @Column()
  restaurantId: string;

  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.Pending,
  })
  status: OrderStatusType;

  @CreateDateColumn({ type: 'timestamptz' })
  orderedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deliveredAt: Date | null;

  @Column({ type: 'float' })
  totalPrice: number;

  @ManyToOne(() => ClientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: ClientEntity;

  @OneToOne(
    () => DeliveryAddressSnapEntity,
    (deliveryAddressSnap) => deliveryAddressSnap.order,
  )
  deliveryAddressSnap: DeliveryAddressSnapEntity;

  @OneToOne(() => OrderRequestEntity, (request) => request.order)
  request: OrderRequestEntity;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;

  @OneToMany(() => OrderItemsEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemsEntity[];

  @OneToOne(() => ReviewEntity, (review) => review.order)
  review: ReviewEntity;

  constructor(
    orderId: string,
    clientId: string,
    restaurantId: string,
    totalPrice: number,
  ) {
    this.orderId = orderId;
    this.clientId = clientId;
    this.restaurantId = restaurantId;
    this.totalPrice = totalPrice;
  }
}
