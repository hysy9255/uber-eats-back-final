import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedClientRequest } from '../interceptors/client-context.interceptor';
import { ClientId } from 'src/client/domain/vo/client-id';

export const CurrentClientId = createParamDecorator(
  (_: unknown, context: ExecutionContext): ClientId => {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedClientRequest>();

    return new ClientId(request.authClient!.clientId);
  },
);
