import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { EmployService } from '../service/employ.service';
import { Public } from '@/features/auth/decorator/public.decorator';
import { EmployDto } from '../dto/employ.dto';
import { JwtPayload } from '@/features/user/type/user.type';
import { Employ } from '../entity/employ.entity';
import { plainToInstance } from 'class-transformer';
import { Role } from '@/features/user/entity/user.entity';
import { Roles } from '@/features/auth/decorator/role.decorator';

@Controller('employes')
export class EmployController {
  constructor(private employService: EmployService) {}

  @Get()
  @Public()
  async getEmployes() {
    const employes = await this.employService.getEmployes();
    const serialized = plainToInstance(Employ, employes);
    return serialized;
  }

  @Roles([Role.ROLE_ADMIN])
  @Get(':id')
  async getEmploy(@Param('id', ParseIntPipe) id: number) {
    const employe = await this.employService.getEmploy(id);
    if (!employe) {
      throw new NotFoundException();
    }
    const serialized = plainToInstance(Employ, employe);
    return serialized;
  }

  @Roles([Role.ROLE_ADMIN])
  @Post()
  async createEmploy(@Request() req, @Body() data: EmployDto) {
    const user: JwtPayload = req.user;
    const newEmploy = await this.employService.createEmploy({
      ...data,
      createdBy: user.id,
    });
    const serialized = plainToInstance(Employ, newEmploy);
    return serialized;
  }

  @Roles([Role.ROLE_ADMIN])
  @Put(':id')
  async updateEmploy(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: EmployDto,
  ) {
    const employ = await this.employService.getEmploy(id);

    if (!employ) {
      throw new BadRequestException();
    }

    await this.employService.updateEmploy(id, data);
  }

  @Roles([Role.ROLE_ADMIN])
  @Delete(':id')
  async deleteEmploy(@Param('id', ParseIntPipe) id: number) {
    const employ = await this.employService.getEmploy(id);

    if (!employ) {
      throw new BadRequestException();
    }

    await this.employService.deleteEmploy(id);
  }
}
