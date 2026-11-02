import { IsEnum, IsString } from 'class-validator';

export enum ClientOrderViewType {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export class ClientOrderQueryDTO {
  @IsEnum(ClientOrderViewType)
  type: ClientOrderViewType;
}

export class ClientOrderDetailQueryDTO {
  @IsString()
  orderId: string;
}
