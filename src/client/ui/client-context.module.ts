import { Module } from '@nestjs/common';
import { ClientContextInterceptor } from './interceptors/client-context.interceptor';
import { ClientRepository } from '../application/ports/client.repository';
import { ClientOrmRepository } from '../infrastructure/repositories/client.orm-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../infrastructure/entities/client.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  providers: [
    ClientContextInterceptor,
    { provide: ClientRepository, useClass: ClientOrmRepository },
  ],
  exports: [ClientRepository],
})
export class ClientContextModule {}
