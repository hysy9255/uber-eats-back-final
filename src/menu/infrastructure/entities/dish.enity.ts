import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { OrderItemsEntity } from 'src/order/infrastructure/entities/order-items.orm-entity';

@Entity('dishes')
export class DishEntity {
  @PrimaryColumn()
  dishId: string;

  @Column()
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  description: string;

  @Column()
  categoryId: string;

  @Column({ type: 'varchar', nullable: true })
  dishImgUrl: string | null;

  @Column()
  availability: boolean;

  @ManyToOne(() => CategoryEntity, (category) => category.dishes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @OneToMany(() => OrderItemsEntity, (orderItem) => orderItem.dish)
  orderItems: OrderItemsEntity[];
}
