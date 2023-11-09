import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../entity/note.entity';
import { Employ } from '@/features/employ/entity/employ.entity';
import { User } from '@/features/user/entity/user.entity';
import { NoteService } from '../service/note.service';
import { NoteController } from '../controller/note.controller';
import { EmployService } from '@/features/employ/service/employ.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Employ, User])],
  controllers: [NoteController],
  providers: [NoteService, EmployService],
  exports: [],
})
export class NoteModule {}
