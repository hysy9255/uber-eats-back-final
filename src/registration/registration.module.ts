import { Module } from '@nestjs/common';
import { RegistrationController } from './ui/registration.controller';
import { RegistrationUiModule } from './ui/registration.ui-module';
import { RegistrationAccountModule } from './account/account-registration.module';
import { RegistrationDeliveryAddressModule } from './delivery-address/delivery-address-registration.module';
import { RegistrationRestaurantModule } from './restaurant/restaurant-registration.module';

@Module({
  imports: [
    RegistrationDeliveryAddressModule,
    RegistrationRestaurantModule,
    RegistrationAccountModule,
    RegistrationUiModule,
  ],
  controllers: [RegistrationController],
})
export class RegistrationModule {}
