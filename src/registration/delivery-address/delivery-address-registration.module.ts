import { Module } from '@nestjs/common';
import { DeliveryAddressInfrastructureModule } from 'src/client/infrastructure/delivery-address-infrastructure.module';
import { RegisterDeliveryAddressService } from './application/register-delivery-address.service';

@Module({
  imports: [DeliveryAddressInfrastructureModule],
  providers: [RegisterDeliveryAddressService],
  exports: [RegisterDeliveryAddressService],
})
export class RegistrationDeliveryAddressModule {}
