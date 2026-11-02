import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ClientAddressBookService } from '../../application/services/client-address-book.service';
import { DeliveryAddressFactory } from '../../domain/factories/delivery-address.factory';
import { DeliveryAddressId } from '../../domain/vo/delivery-address-id';
import { AliasInfoFactory } from '../../domain/factories/alias-info.factory';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { AddNewAddressDTO } from '../dtos/add-new-address.dto';
import { UpdateAddressDTO } from '../dtos/update-address.dto';
import { ClientId } from 'src/client/domain/vo/client-id';
import { AddressFactory } from 'src/shared/infrastructure/factories/address.factory';
import { ClientContextInterceptor } from '../interceptors/client-context.interceptor';
import { CurrentClientId } from '../decorators/current-client-id.decorator';
import { DeliveryAddressDTO } from '../dtos/delivery-address.dto';
import { DeliveryAddressQueryService } from 'src/client/application/services/delivery-address.query.service';

@Controller('delivery-addresses')
@Roles(UserRole.Client)
@UseInterceptors(ClientContextInterceptor)
export class ClientDeliveryAddressController {
  constructor(
    private readonly clientAddressBookService: ClientAddressBookService,
    private readonly deliveryAddressQueryService: DeliveryAddressQueryService,
  ) {}

  @Get()
  async getAddresses(
    @CurrentClientId() clientId: ClientId,
  ): Promise<DeliveryAddressDTO[]> {
    return await this.deliveryAddressQueryService.viewMyAddresses(clientId);
  }

  @Post()
  async addNewAddress(
    @CurrentClientId() clientId: ClientId,
    @Body() dto: AddNewAddressDTO,
  ) {
    await this.clientAddressBookService.addNewAddress(
      clientId,
      DeliveryAddressFactory.create(
        DeliveryAddressId.generate(),
        dto.streetAddress,
        dto.city,
        dto.state,
        dto.zip,
        dto.apt,
        dto.alias,
        dto.customAlias,
      ),
    );
  }

  @Put(':addressId')
  async updateAddress(
    @CurrentClientId() clientId: ClientId,
    @Param('addressId') addressId: string,
    @Body() dto: UpdateAddressDTO,
  ) {
    await this.clientAddressBookService.updateAddress(
      clientId,
      new DeliveryAddressId(addressId),
      AddressFactory.create(
        dto.streetAddress,
        dto.city,
        dto.state,
        dto.zip,
        dto.apt,
      ),
      AliasInfoFactory.create(dto.alias, dto.customAlias),
    );
  }

  @Patch(':addressId/default')
  async markDefaultAddress(
    @CurrentClientId() clientId: ClientId,
    @Param('addressId') addressId: string,
  ) {
    await this.clientAddressBookService.markAddressDefault(
      clientId,
      new DeliveryAddressId(addressId),
    );
  }

  @Delete(':addressId')
  async deleteAddress(
    @CurrentClientId() clientId: ClientId,
    @Param('addressId') addressId: string,
  ) {
    await this.clientAddressBookService.deleteAddress(
      clientId,
      new DeliveryAddressId(addressId),
    );
  }
}
