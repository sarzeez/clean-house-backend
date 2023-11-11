import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileDto } from '../dto/file.dto';
import { File } from '../entity/file.entity';

@Injectable()
export class FileService {
  constructor(@InjectRepository(File) private fileService: Repository<File>) {}

  async createFile(dto: FileDto): Promise<File> {
    const file = this.fileService.create(dto);
    return this.fileService.save(file);
  }

  async updateFile(id: number, data: FileDto) {
    return this.fileService.update({ id }, data);
  }

  deleteFile(id: number) {
    return this.fileService.delete({ id });
  }
}
