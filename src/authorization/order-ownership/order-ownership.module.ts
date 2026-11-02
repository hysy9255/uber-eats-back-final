import { Module } from '@nestjs/common';
import { OrderOwnershipService } from './order-ownership.service';
import { UserInfrastructureModule } from 'src/user/infrastructure/user-infrastructure.module';
import { OrderInfastructureModule } from 'src/order/infrastructure/order-infrastructure.module';

@Module({
  imports: [UserInfrastructureModule, OrderInfastructureModule],
  providers: [OrderOwnershipService],
  exports: [OrderOwnershipService],
})
export class OrderOwnershipModule {}
