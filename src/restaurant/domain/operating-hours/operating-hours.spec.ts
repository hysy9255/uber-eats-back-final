import { BadRequestException } from '@nestjs/common';
import { OperatingHours } from './operating-hours';
import { DayOperatingHoursFactory } from '../factories/day-operating-hours.factory';
import { DayOfWeekType } from './vo/day-of-week';
import { RestaurantId } from '../restaurant/vo/restaurant-id';

describe('OperatingHours', () => {
  const restaurantId = new RestaurantId('restaurant-id');
  const createAllDays = () =>
    Object.values(DayOfWeekType).map((dayOfWeek) =>
      DayOperatingHoursFactory.create(dayOfWeek, false, '09:00', '18:00'),
    );

  describe('constructor', () => {
    it('7일의 운영 시간이 모두 있으면 생성한다', () => {
      const operatingHours = new OperatingHours(restaurantId, createAllDays());

      expect(operatingHours.days).toHaveLength(7);
    });

    it('7일보다 적으면 예외를 던진다', () => {
      const sixDays = createAllDays().slice(0, 6);

      expect(() => new OperatingHours(restaurantId, sixDays)).toThrow(
        BadRequestException,
      );

      expect(() => new OperatingHours(restaurantId, sixDays)).toThrow(
        'Operating hours must contain exactly seven days',
      );
    });

    it('중복된 요일이 있으면 예외를 던진다', () => {
      const days = createAllDays();

      const duplicatedMonday = DayOperatingHoursFactory.create(
        DayOfWeekType.Mon,
        false,
        '10:00',
        '19:00',
      );

      days[1] = duplicatedMonday;

      expect(() => new OperatingHours(restaurantId, days)).toThrow(
        'Operating hours cannot contain duplicate days',
      );
    });
  });

  describe('replaceDay', () => {
    it('같은 요일의 운영 시간을 교체한다', () => {
      const operatingHours = new OperatingHours(restaurantId, createAllDays());

      const updatedMonday = DayOperatingHoursFactory.create(
        DayOfWeekType.Mon,
        false,
        '11:00',
        '22:00',
      );

      operatingHours.replaceDay(updatedMonday);

      const monday = operatingHours.days.find(
        (day) => day.dayOfWeek.value === DayOfWeekType.Mon,
      );

      expect(monday?.isClosed.value).toBe(false);
      expect(monday?.openTime?.value).toBe('11:00');
      expect(monday?.closeTime?.value).toBe('22:00');
    });

    it('휴무일로 운영 시간을 교체할 수 있다', () => {
      const operatingHours = new OperatingHours(restaurantId, createAllDays());

      const closedMonday = DayOperatingHoursFactory.create(
        DayOfWeekType.Mon,
        true,
        null,
        null,
      );

      operatingHours.replaceDay(closedMonday);

      const monday = operatingHours.days.find(
        (day) => day.dayOfWeek.value === DayOfWeekType.Mon,
      );

      expect(monday?.isClosed.value).toBe(true);
      expect(monday?.openTime).toBeNull();
      expect(monday?.closeTime).toBeNull();
    });

    it('존재하지 않는 요일을 교체하려 하면 예외를 던진다', () => {
      const operatingHours = new OperatingHours(restaurantId, createAllDays());

      // 테스트용으로 기존 배열을 하나 제거해 6일 상태를 만든다.
      // 실제 생성자로는 6일 상태를 만들 수 없으므로 replaceDay만 검증하기 위한 setup이다.
      const days = operatingHours.days;
      days.pop();

      const sunday = DayOperatingHoursFactory.create(
        DayOfWeekType.Sun,
        false,
        '09:00',
        '18:00',
      );

      expect(() => operatingHours.replaceDay(sunday)).toThrow(
        'Day operating hours not found',
      );
    });
  });
});
