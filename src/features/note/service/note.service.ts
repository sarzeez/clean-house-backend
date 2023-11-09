import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../entity/note.entity';
import { Repository } from 'typeorm';
import { NoteDto } from '../dto/note.dto';
import { User } from '@/features/user/entity/user.entity';
import { Employ } from '@/features/employ/entity/employ.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteService: Repository<Note>,
    @InjectRepository(User) private userService: Repository<User>,
    @InjectRepository(Employ) private employService: Repository<Employ>,
  ) {}

  getNotes(): Promise<Array<Note>> {
    return this.noteService.find();
  }

  getNote(id: number): Promise<Note> {
    return this.noteService.findOneBy({ id });
  }

  async createNote(userId: number, data: NoteDto) {
    const note = this.noteService.create({ ...data });
    const user = await this.userService.findOneBy({ id: userId });
    const employ = await this.employService.findOneBy({ id: data.employId });
    note.user = user;
    note.employ = employ;
    return this.noteService.save(note);
  }
}
