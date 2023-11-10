import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { File } from '@/features/file/entity/file.entity';

export enum Gender {
  GENDER_MALE = 'male',
  GENDER_FEMALE = 'female',
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ default: null })
  age: number;

  @OneToOne(() => File, (file) => file.profile, { eager: true })
  @JoinColumn({ name: 'file_id' })
  avatar: File;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
