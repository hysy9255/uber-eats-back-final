import { AddressAliasType } from 'src/client/domain/vo/alias-info/address-alias';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('deliveryAddresses')
@Index('UQ_delivery_address_client_alias_except_other', ['clientId', 'alias'], {
  unique: true,
  where: `"alias" != 'other'`,
})
export class DeliveryAddressEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  clientId: string;

  @Column()
  streetAddress: string;

  @Column()
  isDefault: boolean;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column({ type: 'varchar', nullable: true })
  apt: string | null;

  @Column()
  alias: AddressAliasType;

  @Column({ type: 'varchar', nullable: true })
  customAlias: string | null;

  constructor(
    id: string,
    clientId: string,
    streetAddress: string,
    isDefault: boolean,
    city: string,
    state: string,
    zip: string,
    apt: string | null,
    alias: AddressAliasType,
    customAlias: string | null,
  ) {
    this.id = id;
    this.clientId = clientId;
    this.streetAddress = streetAddress;
    this.isDefault = isDefault;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.apt = apt;
    this.alias = alias;
    this.customAlias = customAlias;
  }
}
