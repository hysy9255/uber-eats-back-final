import { BadRequestException } from '@nestjs/common';
import { DayOperatingHours } from './day-operating-hours';
import { DayOfWeek } from './vo/day-of-week';
import { IsClosed } from './vo/is-closed';
import { LocalTime } from './vo/local-time';

describe('DayOperatingHours', () => {
  const dayOfWeek = {} as DayOfWeek;

  const createIsClosed = (value: boolean): IsClosed => ({
    value,
  });

  const createLocalTime = (isBeforeResult = true) => {
    const isBeforeMock = jest.fn().mockReturnValue(isBeforeResult);

    const localTime = {
      isBefore: isBeforeMock,
    } as unknown as LocalTime;

    return {
      localTime,
      isBeforeMock,
    };
  };

  describe('constructor', () => {
    it('휴무일이고 운영 시간이 없으면 생성된다', () => {
      const hours = new DayOperatingHours(
        dayOfWeek,
        createIsClosed(true),
        null,
        null,
      );

      expect(hours.isClosed.value).toBe(true);
      expect(hours.openTime).toBeNull();
      expect(hours.closeTime).toBeNull();
    });

    it('휴무일인데 openTime이 있으면 예외를 던진다', () => {
      const { localTime: openTime } = createLocalTime();

      expect(
        () =>
          new DayOperatingHours(
            dayOfWeek,
            createIsClosed(true),
            openTime,
            null,
          ),
      ).toThrow(
        new BadRequestException('Closed day cannot have operating hours'),
      );
    });

    it('휴무일인데 closeTime이 있으면 예외를 던진다', () => {
      const { localTime: closeTime } = createLocalTime();

      expect(
        () =>
          new DayOperatingHours(
            dayOfWeek,
            createIsClosed(true),
            null,
            closeTime,
          ),
      ).toThrow(
        new BadRequestException('Closed day cannot have operating hours'),
      );
    });

    it('휴무일인데 openTime과 closeTime이 모두 있으면 예외를 던진다', () => {
      const { localTime: openTime } = createLocalTime();
      const { localTime: closeTime } = createLocalTime();

      expect(
        () =>
          new DayOperatingHours(
            dayOfWeek,
            createIsClosed(true),
            openTime,
            closeTime,
          ),
      ).toThrow(
        new BadRequestException('Closed day cannot have operating hours'),
      );
    });

    it('영업일인데 openTime이 없으면 예외를 던진다', () => {
      const { localTime: closeTime } = createLocalTime();

      expect(
        () =>
          new DayOperatingHours(
            dayOfWeek,
            createIsClosed(false),
            null,
            closeTime,
          ),
      ).toThrow(
        new BadRequestException(
          'Open day requires both openTime and closeTime',
        ),
      );
    });

    it('영업일인데 closeTime이 없으면 예외를 던진다', () => {
      const { localTime: openTime } = createLocalTime();

      expect(
        () =>
          new DayOperatingHours(
            dayOfWeek,
            createIsClosed(false),
            openTime,
            null,
          ),
      ).toThrow(
        new BadRequestException(
          'Open day requires both openTime and closeTime',
        ),
      );
    });

    it('영업일인데 openTime과 closeTime이 모두 없으면 예외를 던진다', () => {
      expect(
        () =>
          new DayOperatingHours(dayOfWeek, createIsClosed(false), null, null),
      ).toThrow(
        new BadRequestException(
          'Open day requires both openTime and closeTime',
        ),
      );
    });

    it('openTime이 closeTime보다 빠르면 생성된다', () => {
      const { localTime: openTime, isBeforeMock } = createLocalTime(true);

      const { localTime: closeTime } = createLocalTime();

      const hours = new DayOperatingHours(
        dayOfWeek,
        createIsClosed(false),
        openTime,
        closeTime,
      );

      expect(hours.openTime).toBe(openTime);
      expect(hours.closeTime).toBe(closeTime);
      expect(isBeforeMock).toHaveBeenCalledWith(closeTime);
    });

    it('openTime이 closeTime보다 빠르지 않으면 예외를 던진다', () => {
      const { localTime: openTime, isBeforeMock } = createLocalTime(false);

      const { localTime: closeTime } = createLocalTime();

      expect(
        () =>
          new DayOperatingHours(
            dayOfWeek,
            createIsClosed(false),
            openTime,
            closeTime,
          ),
      ).toThrow(
        new BadRequestException('Open time must be earlier than close time'),
      );

      expect(isBeforeMock).toHaveBeenCalledWith(closeTime);
    });
  });

  describe('getters', () => {
    it('dayOfWeek과 운영 정보를 반환한다', () => {
      const isClosed = createIsClosed(false);
      const { localTime: openTime } = createLocalTime(true);
      const { localTime: closeTime } = createLocalTime();

      const hours = new DayOperatingHours(
        dayOfWeek,
        isClosed,
        openTime,
        closeTime,
      );

      expect(hours.dayOfWeek).toBe(dayOfWeek);
      expect(hours.isClosed).toBe(isClosed);
      expect(hours.openTime).toBe(openTime);
      expect(hours.closeTime).toBe(closeTime);
    });
  });
});
