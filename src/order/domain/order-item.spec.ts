import { OrderItem } from './order-item';
import { OrderItemId } from './vo/order-item-id';
import { Quantity } from './vo/quantity';

import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';
import { Price } from 'src/menu/domain/value-objects/price';

describe('OrderItem', () => {
  const createOrderItem = (quantity = 2) =>
    new OrderItem(
      new OrderItemId('order-item-1'),
      new DishId('dish-1'),
      new Quantity(quantity),
    );

  describe('captureDishSnapshot', () => {
    it('메뉴 이름, 단가, 이미지 URL을 snapshot으로 저장한다', () => {
      const orderItem = createOrderItem();

      orderItem.assginDishSnapProps(
        new DishName('Cheese Pizza'),
        new Price(12.5),
        new DishImageUrl('https://example.com/pizza.png'),
      );

      expect(orderItem.dishId.value).toBe('dish-1');
      expect(orderItem.quantity.value).toBe(2);

      expect(orderItem.dishName.value).toBe('cheese pizza');
      expect(orderItem.unitPrice.value).toBe(12.5);
      expect(orderItem.dishImgUrl.value).toBe('https://example.com/pizza.png');
    });

    it('단가와 수량을 곱해 line total price를 계산한다', () => {
      const orderItem = createOrderItem(3);

      orderItem.assginDishSnapProps(
        new DishName('Pasta'),
        new Price(15),
        new DishImageUrl('https://example.com/pasta.png'),
      );

      expect(orderItem.lineTotalPrice.value).toBe(45);
    });

    it('소수 가격도 수량에 맞게 line total price를 계산한다', () => {
      const orderItem = createOrderItem(2);

      orderItem.assginDishSnapProps(
        new DishName('Pizza'),
        new Price(12.5),
        new DishImageUrl('https://example.com/pizza.png'),
      );

      expect(orderItem.lineTotalPrice.value).toBe(25);
    });

    it('snapshot을 다시 캡처하면 최신 값으로 교체한다', () => {
      const orderItem = createOrderItem(2);

      orderItem.assginDishSnapProps(
        new DishName('Old Pizza'),
        new Price(10),
        new DishImageUrl('https://example.com/old.png'),
      );

      orderItem.assginDishSnapProps(
        new DishName('New Pizza'),
        new Price(15),
        new DishImageUrl('https://example.com/new.png'),
      );

      expect(orderItem.dishName.value).toBe('new pizza');
      expect(orderItem.unitPrice.value).toBe(15);
      expect(orderItem.lineTotalPrice.value).toBe(30);
      expect(orderItem.dishImgUrl.value).toBe('https://example.com/new.png');
    });
  });
});
