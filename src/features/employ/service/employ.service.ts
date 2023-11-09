import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employ } from '../entity/employ.entity';
import { CreateEmployDto, EmployDto } from '../dto/employ.dto';
import { unixTime } from '@/utils/date';

@Injectable()
export class EmployService {
  constructor(
    @InjectRepository(Employ) private employService: Repository<Employ>,
  ) {}

  getEmployes(): Promise<Array<Employ>> {
    return this.employService.find({ where: { isDeleted: false } });
  }

  getEmploy(id: number): Promise<Employ> {
    return this.employService.findOne({ where: { id, isDeleted: false } });
  }

  createEmploy(data: CreateEmployDto) {
    const employ = this.employService.create({
      ...data,
      createdAt: unixTime(),
    });
    return this.employService.save(employ);
  }

  updateEmploy(id: number, data: EmployDto) {
    return this.employService.update(id, { ...data, updatedAt: unixTime() });
  }

  deleteEmploy(id: number) {
    return this.employService.update(id, {
      isDeleted: true,
      updatedAt: unixTime(),
    });
  }
}
