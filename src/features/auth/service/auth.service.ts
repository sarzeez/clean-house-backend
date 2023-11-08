import { UserService } from '@/features/user/service/user.service';
import { JwtPayload } from '@/features/user/type/user.type';
import { comparePasswords } from '@/utils/bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<JwtPayload> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    if (comparePasswords(password, user.passwordHash)) {
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    return null;
  }

  async login(user: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}
