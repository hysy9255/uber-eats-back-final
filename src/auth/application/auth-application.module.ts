import { Module } from '@nestjs/common';
import { LoginService } from './services/login.service';
import { UserInfrastructureModule } from 'src/user/infrastructure/user-infrastructure.module';

@Module({
  imports: [UserInfrastructureModule],
  providers: [LoginService],
  exports: [LoginService],
})
export class AuthApplicationModule {}
