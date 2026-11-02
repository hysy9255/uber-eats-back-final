import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerContextInterceptor } from './interceptors/owner-context.interceptor';
import { OwnerRepository } from '../application/ports/owner.repository';
import { OwnerOrmRepository } from '../infrastructure/repositories/owner.orm-repository';
import { OwnerEntity } from '../infrastructure/entities/owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OwnerEntity])],
  providers: [
    OwnerContextInterceptor,
    { provide: OwnerRepository, useClass: OwnerOrmRepository },
  ],
  exports: [OwnerRepository],
})
export class OwnerContextModule {}
