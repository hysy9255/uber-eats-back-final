import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerEntity } from './infrastructure/entities/owner.entity';
import { OwnerQueryController } from './ui/owner-query.controller';
import { OwnerQueryService } from './application/owner-query.service';

@Module({
  imports: [TypeOrmModule.forFeature([OwnerEntity])],
  providers: [OwnerQueryService],
  controllers: [OwnerQueryController],
})
export class OwnerModule {}
