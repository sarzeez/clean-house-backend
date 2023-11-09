import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employ } from '../entity/employ.entity';
import { EmployService } from '../service/employ.service';
import { EmployController } from '../controller/employ.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employ])],
  controllers: [EmployController],
  providers: [EmployService],
  exports: [],
})
export class EmployModule {}
