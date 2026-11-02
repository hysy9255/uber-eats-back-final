export class DeliveryAddressDTO {
  deliveryAddressId: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  apt: string | null;
  isDefault: boolean;
  alias: string;

  constructor(
    deliveryAddressId: string,
    streetAddress: string,
    city: string,
    state: string,
    zip: string,
    apt: string | null,
    isDefault: boolean,
    alias: string,
  ) {
    this.deliveryAddressId = deliveryAddressId;
    this.streetAddress = streetAddress;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.apt = apt;
    this.isDefault = isDefault;
    this.alias = alias;
  }
}
