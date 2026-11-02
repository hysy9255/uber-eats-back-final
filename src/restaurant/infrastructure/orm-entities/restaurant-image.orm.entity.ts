import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { RestaurantEntity } from './restaurant.orm-entity';

@Entity('restaurant-galleries')
export class RestaurantGalleryEntity {
  @PrimaryColumn()
  restaurantId: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string | null;

  @Column()
  mainImg: string;

  @Column()
  sub1Img: string;

  @Column()
  sub2Img: string;

  @Column()
  bannerImg: string;

  @OneToOne(() => RestaurantEntity, (restaurant) => restaurant.gallery, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;

  constructor(
    restaurantId: string,
    logo: string | null,
    mainImg: string,
    sub1Img: string,
    sub2Img: string,
    bannerImg: string,
  ) {
    this.restaurantId = restaurantId;
    this.logo = logo;
    this.mainImg = mainImg;
    this.sub1Img = sub1Img;
    this.sub2Img = sub2Img;
    this.bannerImg = bannerImg;
  }
}
