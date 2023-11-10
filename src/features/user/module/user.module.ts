import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entity/user.entity';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { Profile } from '../entity/profile.entity';
import { Note } from '@/features/note/entity/note.entity';
import { File } from '@/features/file/entity/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Note, File])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
