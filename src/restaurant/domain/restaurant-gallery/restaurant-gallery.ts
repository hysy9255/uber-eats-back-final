import { RestaurantId } from '../restaurant/vo/restaurant-id';
import { GeneralImageUrl } from './vo/general-image-url';

export class RestaurantGallery {
  constructor(
    readonly restaurantId: RestaurantId,
    private _logo: GeneralImageUrl | null,
    private _mainImage: GeneralImageUrl,
    private _sub1Image: GeneralImageUrl,
    private _sub2Image: GeneralImageUrl,
    private _bannerImage: GeneralImageUrl,
  ) {}

  update(
    logo?: GeneralImageUrl | null,
    mainImage?: GeneralImageUrl,
    sub1Image?: GeneralImageUrl,
    sub2Image?: GeneralImageUrl,
    bannerImage?: GeneralImageUrl,
  ) {
    this._logo = logo !== undefined ? logo : this._logo;
    this._mainImage = mainImage !== undefined ? mainImage : this._mainImage;
    this._sub1Image = sub1Image !== undefined ? sub1Image : this._sub1Image;
    this._sub2Image = sub2Image !== undefined ? sub2Image : this._sub2Image;
    this._bannerImage =
      bannerImage !== undefined ? bannerImage : this._bannerImage;
  }

  get logo() {
    return this._logo;
  }

  get mainImage() {
    return this._mainImage;
  }

  get sub1Image() {
    return this._sub1Image;
  }

  get sub2Image() {
    return this._sub2Image;
  }

  get bannerImage() {
    return this._bannerImage;
  }
}
