import { AccountRegistrationService } from './application/account-registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { ClientEntity } from 'src/client/infrastructure/entities/client.orm-entity';
import { OwnerEntity } from 'src/owner/infrastructure/entities/owner.entity';
import { AccountRegistrationRepository } from './application/ports/account-registration.repository';
import { AccountRegistrationOrmRepository } from './infrastructure/account-registration.orm-repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ClientEntity, OwnerEntity])],
  providers: [
    AccountRegistrationService,
    {
      provide: AccountRegistrationRepository,
      useClass: AccountRegistrationOrmRepository,
    },
  ],
  exports: [AccountRegistrationService],
})
export class RegistrationAccountModule {}
