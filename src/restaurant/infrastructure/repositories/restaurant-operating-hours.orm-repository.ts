import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantOperatingHoursRepository } from 'src/restaurant/application/ports/restaurant-operating-hours.repository';
import { RestaurantHoursEntity } from '../orm-entities/restaurant-hours.orm.entity';
import { Repository } from 'typeorm';
import { OperatingHours } from 'src/restaurant/domain/operating-hours/operating-hours';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { NotFoundException } from '@nestjs/common';
import { DayOperatingHoursFactory } from 'src/restaurant/domain/factories/day-operating-hours.factory';

export class RestaurantOperatingHoursOrmRepository extends RestaurantOperatingHoursRepository {
  constructor(
    @InjectRepository(RestaurantHoursEntity)
    private readonly restaurantHoursRepo: Repository<RestaurantHoursEntity>,
  ) {
    super();
  }

  async findByRestaurantId(
    restaurantId: RestaurantId,
  ): Promise<OperatingHours | null> {
    const days = await this.restaurantHoursRepo.find({
      where: { restaurantId: restaurantId.value },
    });

    return new OperatingHours(
      restaurantId,
      days.map((day) =>
        DayOperatingHoursFactory.create(
          day.dayOfWeek,
          day.isClosed,
          day.openTime,
          day.closeTime,
        ),
      ),
    );
  }

  async saveUpdate(
    restaurantId: RestaurantId,
    updatedOperatingHours: OperatingHours,
  ): Promise<void> {
    const hours = await this.restaurantHoursRepo.find({
      where: { restaurantId: restaurantId.value },
    });
    for (const updatedDay of updatedOperatingHours.days) {
      const day = hours.find(
        (hour) => hour.dayOfWeek === updatedDay.dayOfWeek.value,
      );
      if (!day) throw new NotFoundException('Day not found');
      day.isClosed = updatedDay.isClosed.value;
      day.openTime =
        updatedDay.openTime === null ? null : updatedDay.openTime.value;
      day.closeTime =
        updatedDay.closeTime === null ? null : updatedDay.closeTime.value;
    }

    await this.restaurantHoursRepo.save(hours);
  }
}
