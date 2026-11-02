import { ClientEntity } from 'src/client/infrastructure/entities/client.orm-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItemEntity } from './cart-item.orm-entity';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clientId: string;

  @Column({ type: 'varchar', nullable: true })
  restaurantId: string | null;

  @OneToOne(() => ClientEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client: ClientEntity;

  @OneToMany(() => CartItemEntity, (items) => items.cart)
  items: CartItemEntity[];

  @ManyToOne(() => RestaurantEntity)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity | null;

  constructor(clientId: string, restaurantId: string | null) {
    this.clientId = clientId;
    this.restaurantId = restaurantId;
  }
}
