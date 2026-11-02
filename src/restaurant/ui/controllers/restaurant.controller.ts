import { Body, Controller, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { RestaurantService } from '../../application/services/restaurant.service';
import { RestaurantId } from '../../domain/restaurant/vo/restaurant-id';
import { RestaurantName } from '../../domain/restaurant-profile/vo/restaurant-name';
import { UpdateRestaurantProfileDTO } from './../dtos/update-restaurant-profile.dto';
import { UpdateRestaurantHoursDTO } from './../dtos/update-restaurant-hours.dto';
import { CuisineType } from '../../domain/restaurant-profile/vo/cuisine-type';
import { RestaurantEmail } from '../../domain/restaurant-profile/vo/restaurant-email';
import { InstagramUrl } from '../../domain/restaurant-profile/vo/instagram-url';
import { WebsiteUrl } from '../../domain/restaurant-profile/vo/website-url';
import { StorePhone } from '../../domain/restaurant-profile/vo/store-phone';
import { GeneralImageUrl } from '../../domain/restaurant-gallery/vo/general-image-url';
import { UpdateRestaurantAddressDTO } from './../dtos/update-restaurant-address.dto';
import { UpdateRestaurantImagesDTO } from './../dtos/update-restaurant-images.dto';
import { AddressFactory } from 'src/shared/infrastructure/factories/address.factory';
import { DayOperatingHoursFactory } from '../../domain/factories/day-operating-hours.factory';
import { UserRole } from 'src/auth/application/ports/find-user';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { RestaurantOwnershipGuard } from 'src/authorization/restaurant-ownership/ui/restaurant-ownership.guard';
import { mapIfDefinedOrNull } from './../mappers/map-if-defined-or-null';
import { mapIfDefined } from './../mappers/map-if-defined';
import { UpdateRestaurantSettingDTO } from '../dtos/update-restaurant-setting.dto';

@Controller('restaurants/:restaurantId')
@Roles(UserRole.Owner)
@UseGuards(RestaurantOwnershipGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Patch('settings')
  async updateSetting(
    @Param('restaurantId') restaurantId: string,
    @Body() body: UpdateRestaurantSettingDTO,
  ) {
    await this.restaurantService.updateRestaurantSetting(
      new RestaurantId(restaurantId),
      body.updatedAddress &&
        AddressFactory.create(
          body.updatedAddress.streetAddress,
          body.updatedAddress.city,
          body.updatedAddress.state,
          body.updatedAddress.zip,
          body.updatedAddress.apt,
        ),
      body.updatedImages && {
        logo: mapIfDefinedOrNull(
          body.updatedImages.logo,
          (value) => new GeneralImageUrl(value),
        ),
        mainImage: mapIfDefined(
          body.updatedImages.mainImage,
          (value) => new GeneralImageUrl(value),
        ),
        sub1Image: mapIfDefined(
          body.updatedImages.sub1Image,
          (value) => new GeneralImageUrl(value),
        ),
        sub2Image: mapIfDefined(
          body.updatedImages.sub2Image,
          (value) => new GeneralImageUrl(value),
        ),
        bannerImage: mapIfDefined(
          body.updatedImages.bannerImage,
          (value) => new GeneralImageUrl(value),
        ),
      },
      body.updatedProfile && {
        newName: mapIfDefined(
          body.updatedProfile.newName,
          (value) => new RestaurantName(value),
        ),
        newCuisineType: mapIfDefined(
          body.updatedProfile.newCuisineType,
          (value) => new CuisineType(value),
        ),
        newEmail: mapIfDefinedOrNull(
          body.updatedProfile.newEmail,
          (value) => new RestaurantEmail(value),
        ),
        newInstagram: mapIfDefinedOrNull(
          body.updatedProfile.newInstagram,
          (value) => new InstagramUrl(value),
        ),
        newWebsite: mapIfDefinedOrNull(
          body.updatedProfile.newWebsite,
          (value) => new WebsiteUrl(value),
        ),
        newStorePhone: mapIfDefinedOrNull(
          body.updatedProfile.newStorePhone,
          (value) => new StorePhone(value),
        ),
      },
    );
  }

  @Put('address')
  async updateAdress(
    @Param('restaurantId') restaurantId: string,
    @Body() body: UpdateRestaurantAddressDTO,
  ) {
    await this.restaurantService.updateAddress(
      new RestaurantId(restaurantId),
      AddressFactory.create(
        body.streetAddress,
        body.city,
        body.state,
        body.zip,
        body.apt,
      ),
    );
  }

  @Patch('images')
  async updateImages(
    @Param('restaurantId') restaurantId: string,
    @Body() body: UpdateRestaurantImagesDTO,
  ) {
    await this.restaurantService.updateImages(
      new RestaurantId(restaurantId),
      mapIfDefinedOrNull(body.logo, (value) => new GeneralImageUrl(value)),
      mapIfDefined(body.mainImage, (value) => new GeneralImageUrl(value)),
      mapIfDefined(body.sub1Image, (value) => new GeneralImageUrl(value)),
      mapIfDefined(body.sub2Image, (value) => new GeneralImageUrl(value)),
      mapIfDefined(body.bannerImage, (value) => new GeneralImageUrl(value)),
    );
  }

  @Patch('profile')
  async updatProfile(
    @Param('restaurantId') restaurantId: string,
    @Body() body: UpdateRestaurantProfileDTO,
  ) {
    await this.restaurantService.updateProfile(
      new RestaurantId(restaurantId),
      mapIfDefined(body.newName, (value) => new RestaurantName(value)),
      mapIfDefined(body.newCuisineType, (value) => new CuisineType(value)),
      mapIfDefinedOrNull(body.newEmail, (value) => new RestaurantEmail(value)),
      mapIfDefinedOrNull(body.newInstagram, (value) => new InstagramUrl(value)),
      mapIfDefinedOrNull(body.newWebsite, (value) => new WebsiteUrl(value)),
      mapIfDefinedOrNull(body.newStorePhone, (value) => new StorePhone(value)),
    );
  }

  @Patch('hours')
  async updateHours(
    @Param('restaurantId') restaurantId: string,
    @Body() body: UpdateRestaurantHoursDTO[],
  ) {
    await this.restaurantService.updateHours(
      new RestaurantId(restaurantId),
      body.map((day) =>
        DayOperatingHoursFactory.create(
          day.dayOfWeek,
          day.isClosed,
          day.openTime,
          day.closeTime,
        ),
      ),
    );
  }
}
