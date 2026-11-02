import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AccountRegistrationService } from '../account/application/account-registration.service';
import { Email } from 'src/user/domain/vo/email';
import { Password } from 'src/user/domain/vo/password';
import { UserName } from 'src/user/domain/vo/user-name';
import { PhoneNumber } from 'src/user/domain/vo/phone-number';
import { ImageUrl } from 'src/shared/vo/image-url';
import { RegisterDeliveryAddressService } from '../delivery-address/application/register-delivery-address.service';
import { RegisterDeliveryAddressDTO } from './dtos/register-delivery-address.dto';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { ClientContextInterceptor } from 'src/client/ui/interceptors/client-context.interceptor';
import { CurrentClientId } from 'src/client/ui/decorators/current-client-id.decorator';
import { ClientId } from 'src/client/domain/vo/client-id';
import { DeliveryAddressId } from 'src/client/domain/vo/delivery-address-id';
import { DeliveryAddressFactory } from 'src/client/domain/factories/delivery-address.factory';
import { RegisterRestaurantService } from '../restaurant/application/register-restaurant.service';
import { OwnerId } from 'src/owner/domain/owner-id';
import { RegisterRestaurantDTO } from './dtos/register-restaurant.dto';
import { OwnerContextInterceptor } from 'src/owner/ui/interceptors/owner-context.interceptor';
import { CurrentOwnerId } from 'src/owner/ui/decorators/current-owner-id.decorator';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import {
  RestaurantStatus,
  RestaurantStatusType,
} from 'src/restaurant/domain/restaurant/vo/restaurant-status';
import { RestaurantProfileFactory } from 'src/restaurant/domain/factories/restaurant-profile.factory';
import { RestaurantGalleryFactory } from 'src/restaurant/domain/factories/restaurant-gallery.factory';
import { OperatingHours } from 'src/restaurant/domain/operating-hours/operating-hours';
import { DayOperatingHoursFactory } from 'src/restaurant/domain/factories/day-operating-hours.factory';
import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { AddressFactory } from 'src/shared/infrastructure/factories/address.factory';
import { Public } from 'src/auth/ui/guards/auth.guard';
import { RegisterClientDTO } from './dtos/register-client.dto';
import { RegisterOwnerDTO } from './dtos/register-owner.dto';
import { generateDefaultHours } from '../restaurant/utils/generateDefaultHours';
import { Transactional } from 'typeorm-transactional';

@Controller('registration')
export class RegistrationController {
  constructor(
    private readonly registrationService: AccountRegistrationService,
    private readonly deliveryAddress: RegisterDeliveryAddressService,
    private readonly restaurant: RegisterRestaurantService,
  ) {}

  @Post('client')
  @Public()
  @Transactional()
  async registerClient(@Body() body: RegisterClientDTO) {
    const { clientId } = await this.registrationService.registerClient(
      new Email(body.account.email),
      new Password(body.account.password),
      new UserName(body.account.name),
      new PhoneNumber(body.account.phoneNumber),
      new ImageUrl(body.account.profileImage),
    );

    await this.deliveryAddress.registerDeliveryAddress(
      clientId,
      DeliveryAddressFactory.create(
        DeliveryAddressId.generate(),
        body.deliveryAddress.streetAddress,
        body.deliveryAddress.city,
        body.deliveryAddress.state,
        body.deliveryAddress.zip,
        body.deliveryAddress.apt,
        body.deliveryAddress.alias,
        body.deliveryAddress.customAlias,
      ),
    );
  }

  @Post('owner')
  @Public()
  @Transactional()
  async registerOwner(@Body() body: RegisterOwnerDTO) {
    const { ownerId } = await this.registrationService.registerOwner(
      new Email(body.account.email),
      new Password(body.account.password),
      new UserName(body.account.name),
      new PhoneNumber(body.account.phoneNumber),
      new ImageUrl(body.account.profileImage),
    );
    const restaurantId = RestaurantId.generate();
    await this.restaurant.register(
      new Restaurant(
        restaurantId,
        ownerId,
        new RestaurantStatus(RestaurantStatusType.Closed),
      ),
      RestaurantProfileFactory.create(
        restaurantId.value,
        body.restaurant.profile.name,
        body.restaurant.profile.cuisineType,
        body.restaurant.profile.email,
        body.restaurant.profile.instagram,
        body.restaurant.profile.website,
        body.restaurant.profile.storePhone,
      ),
      RestaurantGalleryFactory.create(
        restaurantId.value,
        body.restaurant.images.logo,
        body.restaurant.images.mainImage,
        body.restaurant.images.sub1Image,
        body.restaurant.images.sub2Image,
        body.restaurant.images.bannerImage,
      ),
      new OperatingHours(restaurantId, generateDefaultHours()),
      new RestaurantAddress(
        restaurantId,
        AddressFactory.create(
          body.restaurant.address.streetAddress,
          body.restaurant.address.city,
          body.restaurant.address.state,
          body.restaurant.address.zip,
          body.restaurant.address.apt,
        ),
      ),
    );
  }

  @Post('delivery-address')
  @Roles(UserRole.Client)
  @UseInterceptors(ClientContextInterceptor)
  async registerDeliveryAddress(
    @CurrentClientId() clientId: ClientId,
    @Body() body: RegisterDeliveryAddressDTO,
  ) {
    return this.deliveryAddress.registerDeliveryAddress(
      clientId,
      DeliveryAddressFactory.create(
        DeliveryAddressId.generate(),
        body.streetAddress,
        body.city,
        body.state,
        body.zip,
        body.apt,
        body.alias,
        body.customAlias,
      ),
    );
  }

  @Post('restaurant')
  @Roles(UserRole.Owner)
  @UseInterceptors(OwnerContextInterceptor)
  async registerRestaurant(
    @CurrentOwnerId() ownerId: OwnerId,
    @Body() body: RegisterRestaurantDTO,
  ) {
    const restaurantId = RestaurantId.generate();
    return this.restaurant.register(
      new Restaurant(
        restaurantId,
        ownerId,
        new RestaurantStatus(RestaurantStatusType.Closed),
      ),
      RestaurantProfileFactory.create(
        restaurantId.value,
        body.profile.name,
        body.profile.cuisineType,
        body.profile.email,
        body.profile.instagram,
        body.profile.website,
        body.profile.storePhone,
      ),
      RestaurantGalleryFactory.create(
        restaurantId.value,
        body.images.logo,
        body.images.mainImage,
        body.images.sub1Image,
        body.images.sub2Image,
        body.images.bannerImage,
      ),
      new OperatingHours(
        restaurantId,
        body.hours.days.map((day) =>
          DayOperatingHoursFactory.create(
            day.dayOfWeek,
            day.isClosed,
            day.openTime,
            day.closeTime,
          ),
        ),
      ),
      new RestaurantAddress(
        restaurantId,
        AddressFactory.create(
          body.address.streetAddress,
          body.address.city,
          body.address.state,
          body.address.zip,
          body.address.apt,
        ),
      ),
    );
  }
}
