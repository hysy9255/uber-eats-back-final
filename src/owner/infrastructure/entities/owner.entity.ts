import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('owners')
export class OwnerEntity {
  @PrimaryColumn({ unique: true })
  ownerId: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToOne(() => RestaurantEntity, (restaurant) => restaurant.owner)
  restaurant: RestaurantEntity;

  constructor(ownerId: string, userId: string) {
    this.ownerId = ownerId;
    this.userId = userId;
  }
}
