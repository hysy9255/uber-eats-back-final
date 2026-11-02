import { Apt } from './vo/apt';
import { City } from './vo/city';
import { State } from './vo/state';
import { StreetAddress } from './vo/street-address';
import { Zip } from './vo/zip';

export class Address {
  constructor(
    readonly streetAddress: StreetAddress,
    readonly city: City,
    readonly state: State,
    readonly zip: Zip,
    readonly apt: Apt | null,
  ) {}
}
