import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantAddressRepository } from 'src/restaurant/application/ports/restaurant-address.repository';
import { RestaurantAddressEntity } from '../orm-entities/restaurant-address.orm.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { AddressFactory } from 'src/shared/infrastructure/factories/address.factory';

export class RestaurantAddressOrmRepository extends RestaurantAddressRepository {
  constructor(
    @InjectRepository(RestaurantAddressEntity)
    private readonly restaurantAddressRepo: Repository<RestaurantAddressEntity>,
  ) {
    super();
  }

  async findOneByRestaurantId(restaurantId: RestaurantId) {
    const result = await this.restaurantAddressRepo.findOne({
      where: { restaurantId: restaurantId.value },
    });
    if (!result) throw new NotFoundException('Restaurant Address Not Found');

    return new RestaurantAddress(
      restaurantId,
      AddressFactory.create(
        result.streetAddress,
        result.city,
        result.state,
        result.zip,
        result.apt,
      ),
    );
  }

  async saveUpdate(updatedAddress: RestaurantAddress) {
    const existing = await this.restaurantAddressRepo.findOne({
      where: { restaurantId: updatedAddress.restaurantId.value },
    });
    if (!existing) throw new NotFoundException('Restaurant Address Not Found');
    existing.streetAddress = updatedAddress.address.streetAddress.value;
    existing.city = updatedAddress.address.city.value;
    existing.state = updatedAddress.address.state.value;
    existing.zip = updatedAddress.address.zip.value;
    existing.apt = updatedAddress.address.apt?.value || null;
    await this.restaurantAddressRepo.save(existing);
  }
}
