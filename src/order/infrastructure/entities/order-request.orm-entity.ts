import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.orm-entity';

@Entity('order_requests')
export class OrderRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  orderRequestId: string;

  @Column()
  orderId: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  requestToRestaurant: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  requestToDriver: string | null;

  @OneToOne(() => OrderEntity, (order) => order.request, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  constructor(
    orderId: string,
    requestToRestaurant: string | null,
    requestToDriver: string | null,
  ) {
    this.orderId = orderId;
    this.requestToRestaurant = requestToRestaurant;
    this.requestToDriver = requestToDriver;
  }
}
