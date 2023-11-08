import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../service/user.service';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { encryptPassword } from '@/utils/bcrypt';
import { Role, User } from '../entity/user.entity';
import { UserProfileDto } from '../dto/profile.dto';
import { JwtPayload } from '../type/user.type';
import { Roles } from '@/features/auth/decorator/role.decorator';
import { Public } from '@/features/auth/decorator/public.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Request() req) {
    const bodyUser: JwtPayload = req.user;
    const user = await this.userService.getUserByEmail(bodyUser.email);
    const serialized = plainToInstance(User, user);
    return serialized;
  }

  @Roles([Role.ROLE_ADMIN])
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers() {
    const users = await this.userService.getUsers();
    const serialized = plainToInstance(User, users);
    return serialized;
  }

  @Roles([Role.ROLE_ADMIN])
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    const serialized = plainToInstance(User, user);
    return serialized;
  }

  @Public()
  @Post()
  async createUser(@Body() createUserDto: UserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('Email is already exist');
    }

    const hashedPassword = encryptPassword(password);
    await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    this.userService.updateUser(id, data);
  }

  @Roles([Role.ROLE_ADMIN])
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.deleteUser(id);
  }

  @Put(':id/profile')
  async updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UserProfileDto,
  ) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new BadRequestException();
    }

    if (user.profile) {
      await this.userService.updateUserProfile(user.id, user.profile.id, data);
      return;
    }

    await this.userService.createUserProfile(id, data);
  }
}
