import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './infrastructure/entities/dish.enity';
import { MenuQueryService } from './application/services/menu.query.service';
import { MenuReader } from './application/ports/menu.reader';
import { MenuOrmReader } from './infrastructure/readers/menu.orm-reader';
import { MenuQueryController } from './ui/controllers/menu.query.controller';
import { OwnerMenuQueryController } from './ui/controllers/owner-menu.query.controller';
import { OwnerMenuQueryService } from './application/services/owner-menu.query.service';
import { CategoryEntity } from './infrastructure/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity, CategoryEntity])],
  providers: [
    MenuQueryService,
    OwnerMenuQueryService,
    { provide: MenuReader, useClass: MenuOrmReader },
  ],
  controllers: [MenuQueryController, OwnerMenuQueryController],
})
export class MenuQueryModule {}
