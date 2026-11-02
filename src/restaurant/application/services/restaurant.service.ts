import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantId } from '../../domain/restaurant/vo/restaurant-id';
import { RestaurantName } from 'src/restaurant/domain/restaurant-profile/vo/restaurant-name';
import { CuisineType } from 'src/restaurant/domain/restaurant-profile/vo/cuisine-type';
import { RestaurantEmail } from 'src/restaurant/domain/restaurant-profile/vo/restaurant-email';
import { InstagramUrl } from 'src/restaurant/domain/restaurant-profile/vo/instagram-url';
import { WebsiteUrl } from 'src/restaurant/domain/restaurant-profile/vo/website-url';
import { StorePhone } from 'src/restaurant/domain/restaurant-profile/vo/store-phone';
import { DayOperatingHours } from 'src/restaurant/domain/operating-hours/day-operating-hours';
import { RestaurantProfileRepository } from '../ports/restaurant-profile.repository';
import { RestaurantOperatingHoursRepository } from '../ports/restaurant-operating-hours.repository';
import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { Address } from 'src/shared/infrastructure/entities/address/address';
import { GeneralImageUrl } from 'src/restaurant/domain/restaurant-gallery/vo/general-image-url';
import { RestaurantGalleryRepository } from '../ports/restaurant-gallery.repository';
import { RestaurantAddressRepository } from '../ports/restaurant-address.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantGalleryRepo: RestaurantGalleryRepository,
    private readonly restaurantAddressRepo: RestaurantAddressRepository,
    private readonly restaurantProfileRepo: RestaurantProfileRepository,
    private readonly restaurantOperatingHoursRepo: RestaurantOperatingHoursRepository,
  ) {}

  @Transactional()
  async updateRestaurantSetting(
    restaurantId: RestaurantId,
    newAddress?: Address,
    images?: {
      logo?: GeneralImageUrl | null;
      mainImage?: GeneralImageUrl;
      sub1Image?: GeneralImageUrl;
      sub2Image?: GeneralImageUrl;
      bannerImage?: GeneralImageUrl;
    },
    profile?: {
      newName?: RestaurantName;
      newCuisineType?: CuisineType;
      newEmail?: RestaurantEmail | null;
      newInstagram?: InstagramUrl | null;
      newWebsite?: WebsiteUrl | null;
      newStorePhone?: StorePhone | null;
    },
  ) {
    if (images) {
      await this.updateImages(
        restaurantId,
        images?.logo,
        images?.mainImage,
        images?.sub1Image,
        images?.sub2Image,
        images?.bannerImage,
      );
    }

    if (newAddress) {
      await this.updateAddress(restaurantId, newAddress);
    }

    if (profile) {
      await this.updateProfile(
        restaurantId,
        profile?.newName,
        profile?.newCuisineType,
        profile?.newEmail,
        profile?.newInstagram,
        profile?.newWebsite,
        profile?.newStorePhone,
      );
    }
  }

  async updateImages(
    restaurantId: RestaurantId,
    logo?: GeneralImageUrl | null,
    mainImage?: GeneralImageUrl,
    sub1Image?: GeneralImageUrl,
    sub2Image?: GeneralImageUrl,
    bannerImage?: GeneralImageUrl,
  ) {
    const gallery = await this.findRestaurantGallery(restaurantId);
    gallery.update(logo, mainImage, sub1Image, sub2Image, bannerImage);
    await this.restaurantGalleryRepo.saveUpdate(gallery);
  }

  async updateAddress(restaurantId: RestaurantId, newAddress: Address) {
    const address = await this.findRestaurantAddress(restaurantId);
    address.update(newAddress);
    await this.restaurantAddressRepo.saveUpdate(address);
  }

  async updateProfile(
    restaurantId: RestaurantId,
    newName?: RestaurantName,
    newCuisineType?: CuisineType,
    newEmail?: RestaurantEmail | null,
    newInstagram?: InstagramUrl | null,
    newWebsite?: WebsiteUrl | null,
    newStorePhone?: StorePhone | null,
  ) {
    const profile = await this.findRestaurantProfile(restaurantId);
    profile.update(
      newName,
      newCuisineType,
      newEmail,
      newInstagram,
      newWebsite,
      newStorePhone,
    );
    await this.restaurantProfileRepo.saveUpdate(profile);
  }

  async updateHours(restaurantId: RestaurantId, newDays: DayOperatingHours[]) {
    const operatingHours =
      await this.findRestaurantOperatingHours(restaurantId);
    for (const newDay of newDays) {
      operatingHours.replaceDay(newDay);
    }
    await this.restaurantOperatingHoursRepo.saveUpdate(
      restaurantId,
      operatingHours,
    );
  }

  private async findRestaurantAddress(
    restaurantId: RestaurantId,
  ): Promise<RestaurantAddress> {
    const restaurantAddress =
      await this.restaurantAddressRepo.findOneByRestaurantId(restaurantId);

    if (!restaurantAddress)
      throw new NotFoundException('Restaurant Address Not Found');

    return restaurantAddress;
  }

  private async findRestaurantGallery(restaurantId: RestaurantId) {
    const gallery =
      await this.restaurantGalleryRepo.findOneByRestaurantId(restaurantId);

    if (!gallery) throw new NotFoundException('Restaurant Gallery Not Found');

    return gallery;
  }

  private async findRestaurantOperatingHours(restaurantId: RestaurantId) {
    const operatingHours =
      await this.restaurantOperatingHoursRepo.findByRestaurantId(restaurantId);

    if (!operatingHours)
      throw new NotFoundException('Restaurant Operating Hours Not Found');

    return operatingHours;
  }

  private async findRestaurantProfile(restaurantId: RestaurantId) {
    const restaurantProfile =
      await this.restaurantProfileRepo.findOneByRestaurantId(restaurantId);

    if (!restaurantProfile)
      throw new NotFoundException('Restaurant Profile Not Found');

    return restaurantProfile;
  }
}
