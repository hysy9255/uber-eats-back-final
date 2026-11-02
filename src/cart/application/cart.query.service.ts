import { ClientId } from 'src/client/domain/vo/client-id';
import { CartDTO } from '../ui/dtos/query/cart.dto';
import { Injectable } from '@nestjs/common';
import { CartReader } from './ports/cart.reader';

@Injectable()
export class CartQueryService {
  constructor(private readonly cartReader: CartReader) {}

  async viewMyCart(clientId: ClientId): Promise<CartDTO> {
    return await this.cartReader.findByClientId(clientId);
  }
}
