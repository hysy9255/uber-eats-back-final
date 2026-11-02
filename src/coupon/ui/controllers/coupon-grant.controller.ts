import { Body, Controller, Param, Post } from '@nestjs/common';
import { CouponCatalogue } from '../../application/coupon-catalogue';

import { GrantCouponToClientDTO } from '../dtos/grant-coupon-to-client.dto';

@Controller()
export class CouponCatalogueController {
  constructor(private readonly catalogue: CouponCatalogue) {}

  @Post('clients/:clientId/coupons')
  async grantToClient(
    @Param('clientId') clientId: string,
    @Body() dto: GrantCouponToClientDTO,
  ) {
    await this.catalogue.grantToClient(clientId, dto.code);
  }
}
