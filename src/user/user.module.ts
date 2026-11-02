import { Module } from '@nestjs/common';
import { UserEntity } from './infrastructure/orm-entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './ui/user.controller';
import { UserQueryService } from './application/user.query-service';
import { UserReader } from './application/ports/user.reader';
import { UserOrmReader } from './infrastructure/readers/user.orm-reader';
import { UserService } from './application/user.service';
import { UserRepository } from './application/ports/user.repository';
import { UserOrmRepository } from './infrastructure/repositories/user.orm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserQueryService,
    UserService,
    {
      provide: UserRepository,
      useClass: UserOrmRepository,
    },
    {
      provide: UserReader,
      useClass: UserOrmReader,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
