import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CouponWallet } from '../../application/coupon-wallet';
import { ViewMyCouponDTO } from '../dtos/view-my-coupon.dto';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { ClientContextInterceptor } from 'src/client/ui/interceptors/client-context.interceptor';
import { CurrentClientId } from 'src/client/ui/decorators/current-client-id.decorator';
import { ClientId } from 'src/client/domain/vo/client-id';

@Controller()
export class CouponCatalogueController {
  constructor(private readonly wallet: CouponWallet) {}

  @Get('me/coupon-wallet')
  @Roles(UserRole.Client)
  @UseInterceptors(ClientContextInterceptor)
  async viewMyCoupons(
    @CurrentClientId() clientId: ClientId,
  ): Promise<ViewMyCouponDTO[]> {
    return await this.wallet.viewMyCoupons(clientId);
  }

  async viewCouponAppPrice() {}
}
