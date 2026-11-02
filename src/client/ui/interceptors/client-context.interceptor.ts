import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from 'src/auth/ui/guards/auth.guard';
import { ClientRepository } from 'src/client/application/ports/client.repository';
import { UserId } from 'src/user/domain/vo/user-id';

export interface AuthenticatedClientRequest extends AuthenticatedRequest {
  authClient?: {
    clientId: string;
  };
}

@Injectable()
export class ClientContextInterceptor implements NestInterceptor {
  constructor(private readonly clientRepo: ClientRepository) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedClientRequest>();

    const client = await this.clientRepo.findByUserId(
      new UserId(request.authUser!.userId),
    );

    if (!client) {
      throw new ForbiddenException('Client 정보를 찾을 수 없습니다.');
    }

    request.authClient = { clientId: client.clientId.value };

    return next.handle();
  }
}
