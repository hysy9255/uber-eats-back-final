import { Module } from '@nestjs/common';
import { ClientAddressBookService } from './application/services/client-address-book.service';
import { ClientDeliveryAddressController } from './ui/controllers/client-delivery-address.controller';
import { ClientContextModule } from './ui/client-context.module';
import { DeliveryAddressInfrastructureModule } from './infrastructure/delivery-address-infrastructure.module';
import { DeliveryAddressQueryService } from './application/services/delivery-address.query.service';

@Module({
  imports: [DeliveryAddressInfrastructureModule, ClientContextModule],
  providers: [ClientAddressBookService, DeliveryAddressQueryService],
  controllers: [ClientDeliveryAddressController],
})
export class ClientModule {}
