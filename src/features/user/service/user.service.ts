import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { unixTime } from '@/utils/date';
import { Profile } from '../entity/profile.entity';
import { File } from '@/features/file/entity/file.entity';
import { ProfileType } from '../type/user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private userProfileRepository: Repository<Profile>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  getUsers(): Promise<Array<User>> {
    return this.userRepository.find({ where: { isDeleted: false } });
  }

  getUser(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { isDeleted: false, id },
    });
  }

  getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email, isDeleted: false });
  }

  createUser(createUserDto: UserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: createUserDto.password,
      createdAt: unixTime(),
    });
    return this.userRepository.save(user);
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, {
      ...updateUserDto,
      updatedAt: unixTime(),
    });
  }

  deleteUser(id: number) {
    return this.userRepository.update(id, {
      isDeleted: true,
    });
  }

  async createUserProfile(userId: number, createUserProfileDto: ProfileType) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const newProfile = this.userProfileRepository.create(createUserProfileDto);
    if (createUserProfileDto.avatar) {
      const newFile = this.fileRepository.create(createUserProfileDto.avatar);
      newProfile.avatar = { ...newFile, createdAt: unixTime() };
    }
    const savedProfile = await this.userProfileRepository.save(newProfile);

    user.profile = savedProfile;
    return this.userRepository.save({ ...user, updatedAt: unixTime() });
  }

  async updateUserProfile(
    userId: number,
    profileId: number,
    updateProfileDto: ProfileType,
  ) {
    await this.userRepository.update(userId, {
      updatedAt: unixTime(),
    });
    if (updateProfileDto.avatar) {
      console.log({ avatar: updateProfileDto.avatar });
      const fileId = updateProfileDto.avatar.id;
      const fileDto = updateProfileDto.avatar;
      await this.fileRepository.update(fileId, fileDto);
    }
    return this.userProfileRepository.update(profileId, updateProfileDto);
  }
}
