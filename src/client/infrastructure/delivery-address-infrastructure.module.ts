import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryAddressEntity } from './entities/delivery-address.orm.entity';
import { ClientAddressBookRepository } from '../application/ports/client-address-book.repository';
import { ClientAddressBookOrmRepository } from './repositories/client-address-book.orm-repository';
import { FindDefaultDeliveryAddress } from 'src/order/application/ports/find-delivery-address';
import { FindDefaultDeliveryAddressAdaptor } from './repositories/find-default-delivery-address.adaptor';
import { DeliveryAddressReader } from '../application/ports/delivery-address.reader';
import { DeliveryAddressOrmReader } from './readers/delivery-address.orm-reader';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryAddressEntity])],
  providers: [
    {
      provide: FindDefaultDeliveryAddress,
      useClass: FindDefaultDeliveryAddressAdaptor,
    },
    {
      provide: ClientAddressBookRepository,
      useClass: ClientAddressBookOrmRepository,
    },
    {
      provide: DeliveryAddressReader,
      useClass: DeliveryAddressOrmReader,
    },
  ],
  exports: [
    ClientAddressBookRepository,
    FindDefaultDeliveryAddress,
    DeliveryAddressReader,
  ],
})
export class DeliveryAddressInfrastructureModule {}
