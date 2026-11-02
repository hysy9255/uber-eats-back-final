import { Controller, Get } from '@nestjs/common';
import { UserId } from 'src/user/domain/vo/user-id';
import { CurrentUserId } from 'src/user/ui/user-id.decorator';
import { OwnerQueryService } from '../application/owner-query.service';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { OwnerRestaurantIdDTO } from './dtos/owner-restaurant-id.dto';

@Controller()
export class OwnerQueryController {
  constructor(private readonly ownerQueryService: OwnerQueryService) {}

  @Get('me/restaurant')
  @Roles(UserRole.Owner)
  async getMyRestaurant(
    @CurrentUserId() userId: UserId,
  ): Promise<OwnerRestaurantIdDTO> {
    return this.ownerQueryService.getMyRestaurant(userId);
  }
}
