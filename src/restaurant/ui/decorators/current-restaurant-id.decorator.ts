import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedOwnerRequest } from 'src/owner/ui/interceptors/owner-context.interceptor';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export const CurrentRestaurantId = createParamDecorator(
  (_: unknown, context: ExecutionContext): RestaurantId => {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedOwnerRequest>();

    return new RestaurantId(request.authOwner!.restaurantId!);
  },
);
