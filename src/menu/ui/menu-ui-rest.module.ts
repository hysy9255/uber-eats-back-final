import { Module } from '@nestjs/common';
import { OwnerMenuController } from './controllers/owner-menu.controller';
import { PublicMenuController } from './controllers/public-menu.controller';
import { MenuApplicationModule } from '../application/menu-application.module';
import { RestaurantOwnershipModule } from 'src/authorization/restaurant-ownership/restaurant-ownership.module';

@Module({
  imports: [MenuApplicationModule, RestaurantOwnershipModule],
  controllers: [OwnerMenuController, PublicMenuController],
})
export class MenuUiRestModule {}
