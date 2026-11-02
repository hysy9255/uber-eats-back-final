import { Module } from '@nestjs/common';
import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindUser } from 'src/auth/application/ports/find-user';
import { FindUserAdapter } from './adaptors/find-user.adaptor';
import { FindOwnerUser } from 'src/authorization/order-ownership/ports/find-owner-user';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    FindUserAdapter,
    { provide: FindUser, useExisting: FindUserAdapter },
    { provide: FindOwnerUser, useExisting: FindUserAdapter },
  ],
  exports: [FindUser, FindOwnerUser],
})
export class UserInfrastructureModule {}
