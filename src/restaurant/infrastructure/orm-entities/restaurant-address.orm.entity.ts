import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { RestaurantEntity } from './restaurant.orm-entity';

@Entity('restaurant-addresses')
export class RestaurantAddressEntity {
  @PrimaryColumn()
  restaurantId: string;

  @Column()
  streetAddress: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column({ type: 'varchar', nullable: true })
  apt: string | null;

  @OneToOne(() => RestaurantEntity, (restaurant) => restaurant.address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;

  constructor(
    restaurantId: string,
    streetAddress: string,
    city: string,
    state: string,
    zip: string,
    apt: string | null,
  ) {
    this.restaurantId = restaurantId;
    this.streetAddress = streetAddress;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.apt = apt;
  }
}
