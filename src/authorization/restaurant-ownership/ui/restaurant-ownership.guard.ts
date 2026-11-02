import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from 'src/auth/ui/guards/auth.guard';
import { RestaurantOwnershipService } from '../application/restaurant-ownership.service';

interface RestaurantParams {
  restaurantId: string;
}

export interface AuthenticatedRequest extends Request<RestaurantParams> {
  authUser?: AuthUser;
}

@Injectable()
export class RestaurantOwnershipGuard implements CanActivate {
  constructor(private readonly ownershipService: RestaurantOwnershipService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.authUser) {
      throw new UnauthorizedException();
    }

    const userId = request.authUser.userId;
    const restaurantId = request.params.restaurantId;

    await this.ownershipService.assertUserOwnsRestaurant(userId, restaurantId);
    return true;
  }
}
