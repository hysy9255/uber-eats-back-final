import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.orm-entity';

@Entity('delivery_address_snaps')
export class DeliveryAddressSnapEntity {
  @PrimaryGeneratedColumn('uuid')
  deliveryAddressSnapId: string;

  @Column()
  orderId: string;

  @Column()
  addressSnap: string;

  @OneToOne(() => OrderEntity, (order) => order.orderId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  constructor(orderId: string, addressSnap: string) {
    this.orderId = orderId;
    this.addressSnap = addressSnap;
  }
}
