import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantProfileRepository } from 'src/restaurant/application/ports/restaurant-profile.repository';
import { RestaurantProfileEntity } from '../orm-entities/restaurant-profile.orm-entity';
import { Repository } from 'typeorm';
import { RestaurantProfile } from 'src/restaurant/domain/restaurant-profile/restaurant-profile';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { NotFoundException } from '@nestjs/common';
import { RestaurantProfileFactory } from 'src/restaurant/domain/factories/restaurant-profile.factory';

export class RestaurantProfileOrmRepository extends RestaurantProfileRepository {
  constructor(
    @InjectRepository(RestaurantProfileEntity)
    private readonly restaurantProfileRepo: Repository<RestaurantProfileEntity>,
  ) {
    super();
  }

  async findOneByRestaurantId(
    restaurantId: RestaurantId,
  ): Promise<RestaurantProfile | null> {
    const result = await this.restaurantProfileRepo.findOne({
      where: { restaurantId: restaurantId.value },
    });
    if (!result) return null;
    return RestaurantProfileFactory.create(
      result.restaurantId,
      result.name,
      result.cuisineType,
      result.email,
      result.instagram,
      result.website,
      result.storePhone,
    );
  }

  async saveUpdate(profile: RestaurantProfile): Promise<void> {
    const persisted = await this.restaurantProfileRepo.findOne({
      where: { restaurantId: profile.restaurantId.value },
    });
    if (!persisted)
      throw new NotFoundException('Persisted restaurant profile not found');
    const entity = new RestaurantProfileEntity(
      profile.restaurantId.value,
      profile.name.value,
      profile.cuisineType.value,
      profile.email === null ? null : profile.email.value,
      profile.instagram === null ? null : profile.instagram.value,
      profile.website === null ? null : profile.website.value,
      profile.storePhone === null ? null : profile.storePhone.value,
    );

    await this.restaurantProfileRepo.save(entity);
  }
}
