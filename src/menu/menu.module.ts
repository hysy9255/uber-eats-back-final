import { Module } from '@nestjs/common';
import { MenuUiRestModule } from './ui/menu-ui-rest.module';

@Module({
  imports: [MenuUiRestModule],
})
export class MenuModule {}
