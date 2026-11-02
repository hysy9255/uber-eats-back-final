import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/application/ports/user.repository';
import { UserEntity } from '../orm-entities/user.entity';
import { Repository } from 'typeorm';
// import { User } from 'src/user/domain/user';
import { Email } from 'src/user/domain/vo/email';

export class UserOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  //   async save(user: User): Promise<void> {}

  //   async findById(userId: string): Promise<User> {}

  async findByEmail(email: Email): Promise<boolean> {
    const entity = await this.userRepo.findOne({
      where: { email: email.value },
    });
    if (!entity) {
      return false;
    } else {
      return true;
    }
  }
}
