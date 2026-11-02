import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FindUser, UserRole } from '../ports/find-user';
import { LoginResponseDTO } from 'src/auth/ui/controllers/dtos/login.dto';

export type TokenPayload = {
  userId: string;
  userRole: UserRole;
};

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly findUser: FindUser,
  ) {}

  async login(username: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.findUser.findOne(username);
    if (!user) throw new NotFoundException('User Not Found');

    await this.comparePassord(password, user.password);
    const payload: TokenPayload = {
      userId: user.userId,
      userRole: user.userRole,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async comparePassord(plainPassword: string, hashedPassword: string) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (!match) throw new UnauthorizedException('Wrong password');
  }
}
