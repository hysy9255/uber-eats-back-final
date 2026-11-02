import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { RestaurantEntity } from './restaurant.orm-entity';

@Entity('restaurant-profiles')
export class RestaurantProfileEntity {
  @PrimaryColumn()
  restaurantId: string;

  @Column()
  name: string;

  @Column()
  cuisineType: string;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', nullable: true })
  website: string | null;

  @Column({ type: 'varchar', nullable: true })
  storePhone: string | null;

  @OneToOne(() => RestaurantEntity, (restaurant) => restaurant.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;

  constructor(
    restaurantId: string,
    name: string,
    cuisineType: string,
    email: string | null,
    instagram: string | null,
    website: string | null,
    storePhone: string | null,
  ) {
    this.restaurantId = restaurantId;
    this.name = name;
    this.cuisineType = cuisineType;
    this.email = email;
    this.instagram = instagram;
    this.website = website;
    this.storePhone = storePhone;
  }
}
