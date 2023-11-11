import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NoteDto } from '../dto/note.dto';
import { NoteService } from '../service/note.service';
import { JwtPayload } from '@/features/user/type/user.type';
import { EmployService } from '@/features/employ/service/employ.service';
import { Note } from '../entity/note.entity';
import { plainToInstance } from 'class-transformer';
import { Public } from '@/features/auth/decorator/public.decorator';

@Controller('notes')
@ApiTags('Note')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly employService: EmployService,
  ) {}

  @Get()
  @Public()
  async getNotes() {
    const notes = await this.noteService.getNotes();
    const serialized = plainToInstance(Note, notes);
    return serialized;
  }

  @Post()
  @ApiBearerAuth()
  async createNote(@Request() request: any, @Body() data: NoteDto) {
    const user: JwtPayload = request.user;
    const { employId } = data;
    const employ = await this.employService.getEmploy(employId);
    if (!employ) {
      throw new BadRequestException();
    }
    const result = await this.noteService.createNote(user.id, data);
    const serialized = plainToInstance(Note, result);
    return serialized;
  }
}
