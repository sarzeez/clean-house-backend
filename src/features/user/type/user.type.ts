import { File } from '@/features/file/entity/file.entity';
import { Gender } from '../entity/profile.entity';
import { Role } from '../entity/user.entity';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}

export type ProfileType = {
  gender: Gender;
  age: number;
  avatar?: File;
};
