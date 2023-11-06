import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entity/user.entity';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
