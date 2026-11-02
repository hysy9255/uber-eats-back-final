export enum AddressAliasType {
  home = 'home',
  work = 'work',
  other = 'other',
}

export class AddressAlias {
  constructor(readonly value: AddressAliasType) {}

  equals(other: AddressAlias) {
    return this.value === other.value;
  }
}
