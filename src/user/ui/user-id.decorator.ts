import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserId } from '../domain/vo/user-id';
import { AuthUser } from 'src/auth/ui/guards/auth.guard';

export interface AuthenticatedRequest extends Request {
  authUser: AuthUser;
}

export const CurrentUserId = createParamDecorator(
  (_: unknown, context: ExecutionContext): UserId => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return new UserId(request.authUser.userId);
  },
);
