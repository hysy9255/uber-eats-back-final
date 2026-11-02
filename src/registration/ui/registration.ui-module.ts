import { Module } from '@nestjs/common';
import { ClientContextModule } from 'src/client/ui/client-context.module';
import { OwnerContextModule } from 'src/owner/ui/owner-context.module';

@Module({
  imports: [ClientContextModule, OwnerContextModule],
  exports: [ClientContextModule, OwnerContextModule],
})
export class RegistrationUiModule {}
