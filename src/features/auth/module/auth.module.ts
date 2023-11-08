import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@/features/user/module/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controller/auth.controller';
import { LocalStrategy } from '../strategy/local.strategy';
import { JwtStrategy } from '../strategy/jwt.strategry';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
