import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from './cart.orm-entity';
import { DishEntity } from 'src/menu/infrastructure/entities/dish.enity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dishId: string;

  @Column()
  quantity: number;

  @Column()
  cartId: string;

  @ManyToOne(() => DishEntity)
  @JoinColumn({ name: 'dishId' })
  dish: DishEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  constructor(dishId: string, quantity: number, cartId: string) {
    this.dishId = dishId;
    this.quantity = quantity;
    this.cartId = cartId;
  }
}
