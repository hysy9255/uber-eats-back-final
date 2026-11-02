import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.orm-entity';
import { DishEntity } from 'src/menu/infrastructure/entities/dish.enity';

@Entity('order_items')
export class OrderItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  orderItemId: string;

  @Column()
  orderId: string;

  // 선택: 참조/분석/재주문용
  @Column({ nullable: true })
  dishId: string | null;

  @Column()
  dishName: string;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column({ type: 'float' })
  lineTotalPrice: number;

  @Column({ type: 'varchar', nullable: true })
  dishImgUrl: string | null;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => DishEntity, (dish) => dish.orderItems, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'dishId' })
  dish: DishEntity | null;

  constructor(
    orderId: string,
    dishId: string,
    dishName: string,
    quantity: number,
    unitPrice: number,
    lineTotalPrice: number,
    dishImgUrl: string | null,
  ) {
    this.orderId = orderId;
    this.dishId = dishId;
    this.dishName = dishName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.lineTotalPrice = lineTotalPrice;
    this.dishImgUrl = dishImgUrl;
  }
}
