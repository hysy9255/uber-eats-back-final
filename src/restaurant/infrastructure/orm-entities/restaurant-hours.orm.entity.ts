import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { RestaurantEntity } from './restaurant.orm-entity';
import { DayOfWeekType } from 'src/restaurant/domain/operating-hours/vo/day-of-week';

@Entity('restaurant-hours')
@Unique(['restaurantId', 'dayOfWeek'])
export class RestaurantHoursEntity {
  @PrimaryColumn()
  restaurantId: string;

  @PrimaryColumn({ type: 'enum', enum: DayOfWeekType })
  dayOfWeek: DayOfWeekType;

  @Column()
  isClosed: boolean;

  @Column({ type: 'varchar', nullable: true })
  openTime: string | null;

  @Column({ type: 'varchar', nullable: true })
  closeTime: string | null;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.hours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: RestaurantEntity;

  constructor(
    restaurantId: string,
    dayOfWeek: DayOfWeekType,
    isClosed: boolean,
    openTime: string | null,
    closeTime: string | null,
  ) {
    this.restaurantId = restaurantId;
    this.dayOfWeek = dayOfWeek;
    this.isClosed = isClosed;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }
}
