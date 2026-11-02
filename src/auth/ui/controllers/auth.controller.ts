import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from 'src/auth/application/services/login.service';
import { Public } from '../guards/auth.guard';
import { LoginDTO, LoginResponseDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @Public()
  async login(@Body() body: LoginDTO): Promise<LoginResponseDTO> {
    return this.loginService.login(body.email, body.password);
  }

  // @UseGuards(AuthGuard)
  // @Post('logout')
  // async logout(@CurrentUser() user: AuthUser) {
  //   await this.logoutService.logout(user.userId);
  //   return {
  //     message: 'Logged out successfully',
  //   };
  // }
}
