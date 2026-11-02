import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUserId } from './user-id.decorator';
import { UserId } from '../domain/vo/user-id';
import { UserQueryService } from '../application/user.query-service';
import { UserProfileDTO } from './dtos/user-profile.dto';
import { UserRole } from 'src/auth/application/ports/find-user';
import {
  CheckEmailAvailabilityQueryDTO,
  CheckEmailAvailabilityResponseDTO,
} from './dtos/check-email-availability.dto';
import { Email } from '../domain/vo/email';
import { UserService } from '../application/user.service';
import { Public } from 'src/auth/ui/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userService: UserService,
  ) {}

  @Get('profile')
  async getUserProfile(
    @CurrentUserId() userId: UserId,
  ): Promise<UserProfileDTO> {
    return await this.userQueryService.getUserProfile(userId);
  }

  @Get('me')
  async getMe(@CurrentUserId() userId: UserId): Promise<{ role: UserRole }> {
    return await this.userQueryService.getMe(userId);
  }

  @Public()
  @Get('/email-availability')
  async checkEmailAvailability(
    @Query() dto: CheckEmailAvailabilityQueryDTO,
  ): Promise<CheckEmailAvailabilityResponseDTO> {
    return await this.userService.checkEmailAvailability(new Email(dto.email));
  }

  //   @Patch()
  //   async updateProfile(@CurrentUserId() userId: UserId) {}

  //   @Patch()
  //   async changePassword(@CurrentUserId() userId: UserId) {}
}
