import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedOwnerRequest } from '../interceptors/owner-context.interceptor';
import { OwnerId } from 'src/owner/domain/owner-id';

export const CurrentOwnerId = createParamDecorator(
  (_: unknown, context: ExecutionContext): OwnerId => {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedOwnerRequest>();

    return new OwnerId(request.authOwner!.ownerId);
  },
);
