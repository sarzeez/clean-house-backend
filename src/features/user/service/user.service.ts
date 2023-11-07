import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { unixTime } from '@/utils/date';
import { UserProfileDto } from '../dto/profile.dto';
import { Profile } from '../entity/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private userProfileRepository: Repository<Profile>,
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

  getUserProfile(userId: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
  }

  async createUserProfile(
    userId: number,
    createUserProfileDto: UserProfileDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const newProfile = this.userProfileRepository.create(createUserProfileDto);
    const savedProfile = await this.userProfileRepository.save(newProfile);

    user.profile = savedProfile;
    return this.userRepository.save(user);
  }

  updateUserProfile(profileId: number, updateProfileDto: UserProfileDto) {
    return this.userProfileRepository.update(profileId, updateProfileDto);
  }
}
