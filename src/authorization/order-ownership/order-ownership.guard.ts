import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/auth/ui/guards/auth.guard';
import { OrderOwnershipService } from './order-ownership.service';
import { UserId } from 'src/user/domain/vo/user-id';
import { OrderId } from 'src/order/domain/vo/order-id';

interface OrderParams {
  orderId: string;
}

interface AuthenticatedRequest extends Request<OrderParams> {
  authUser?: AuthUser;
}

@Injectable()
export class OrderOwnershipGuard implements CanActivate {
  constructor(private readonly orderOwnershipService: OrderOwnershipService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.authUser) {
      throw new UnauthorizedException();
    }

    const userId = new UserId(request.authUser.userId);
    const orderId = new OrderId(request.params.orderId);

    await this.orderOwnershipService.assertUserCanManageOrder(userId, orderId);

    return true;
  }
}
