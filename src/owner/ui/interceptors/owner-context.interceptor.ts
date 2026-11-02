import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from 'src/auth/ui/guards/auth.guard';
import { OwnerRepository } from 'src/owner/application/ports/owner.repository';
import { UserId } from 'src/user/domain/vo/user-id';

export interface AuthenticatedOwnerRequest extends AuthenticatedRequest {
  authOwner?: {
    ownerId: string;
    restaurantId?: string;
  };
}

@Injectable()
export class OwnerContextInterceptor implements NestInterceptor {
  constructor(private readonly ownerRepo: OwnerRepository) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedOwnerRequest>();

    const owner = await this.ownerRepo.findByUserId(
      new UserId(request.authUser!.userId),
    );

    if (!owner) {
      throw new ForbiddenException('Owner 정보를 찾을 수 없습니다.');
    }

    request.authOwner = {
      ownerId: owner.ownerId.value,
      restaurantId: owner.restaurantId?.value,
    };

    return next.handle();
  }
}
