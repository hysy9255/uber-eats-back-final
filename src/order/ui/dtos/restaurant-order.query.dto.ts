import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatusType } from 'src/order/domain/order-progress';

export class RestaurantOrderQueryDTO {
  @IsOptional()
  @IsEnum(OrderStatusType)
  status?: OrderStatusType;
}

export class RestaurantOrderDetailQueryDTO {
  @IsString()
  orderId: string;
}
