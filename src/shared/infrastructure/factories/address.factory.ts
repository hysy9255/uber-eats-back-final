import { Address } from 'src/shared/infrastructure/entities/address/address';
import { Apt } from '../entities/address/vo/apt';
import { City } from '../entities/address/vo/city';
import { State } from '../entities/address/vo/state';
import { StreetAddress } from '../entities/address/vo/street-address';
import { Zip } from '../entities/address/vo/zip';

export class AddressFactory {
  static create(
    streetAddress: string,
    city: string,
    state: string,
    zip: string,
    apt: string | null,
  ) {
    return new Address(
      new StreetAddress(streetAddress),
      new City(city),
      new State(state),
      new Zip(zip),
      apt === null ? null : new Apt(apt),
    );
  }
}
