import { Module } from '@nestjs/common';
import { AuthUiModule } from './ui/auth-ui.module';

@Module({
  imports: [AuthUiModule],
})
export class AuthModule {}
