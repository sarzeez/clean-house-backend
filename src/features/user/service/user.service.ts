import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { unixTime } from '@/utils/date';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getUsers(): Promise<Array<User>> {
    return this.userRepository.find({ where: { isDeleted: false } });
  }

  getUser(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { isDeleted: false, id } });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email, isDeleted: false });
  }

  createUser(createUserDto: UserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: createUserDto.password,
      createdAt: unixTime,
    });
    return this.userRepository.save(user);
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, {
      ...updateUserDto,
      updatedAt: unixTime,
    });
  }

  deleteUser(id: number) {
    return this.userRepository.update(id, {
      isDeleted: true,
    });
  }
}
