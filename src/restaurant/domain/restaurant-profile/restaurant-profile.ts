import { RestaurantId } from '../restaurant/vo/restaurant-id';
import { CuisineType } from './vo/cuisine-type';
import { InstagramUrl } from './vo/instagram-url';
import { RestaurantEmail } from './vo/restaurant-email';
import { RestaurantName } from './vo/restaurant-name';
import { StorePhone } from './vo/store-phone';
import { WebsiteUrl } from './vo/website-url';

export class RestaurantProfile {
  constructor(
    readonly restaurantId: RestaurantId,
    private _name: RestaurantName,
    private _cuisineType: CuisineType,
    private _email: RestaurantEmail | null,
    private _instagram: InstagramUrl | null,
    private _website: WebsiteUrl | null,
    private _storePhone: StorePhone | null,
  ) {}

  update(
    name?: RestaurantName,
    cuisineType?: CuisineType,
    email?: RestaurantEmail | null,
    instagram?: InstagramUrl | null,
    website?: WebsiteUrl | null,
    storePhone?: StorePhone | null,
  ) {
    this._name = name ? name : this._name;
    this._cuisineType = cuisineType ? cuisineType : this._cuisineType;
    this._email = email !== undefined ? email : this._email;
    this._instagram = instagram !== undefined ? instagram : this._instagram;
    this._website = website !== undefined ? website : this._website;
    this._storePhone = storePhone !== undefined ? storePhone : this._storePhone;
  }

  get name(): RestaurantName {
    return this._name;
  }

  get cuisineType(): CuisineType {
    return this._cuisineType;
  }

  get email() {
    return this._email;
  }

  get instagram() {
    return this._instagram;
  }

  get website() {
    return this._website;
  }

  get storePhone() {
    return this._storePhone;
  }
}
