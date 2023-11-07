import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Profile } from './profile.entity';

export enum Role {
  ROLE_USER = 'role_user',
  ROLE_ADMIN = 'role_admin',
  ROLE_SUPERADMIN = 'role_superadmin',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ROLE_USER,
  })
  role: Role;

  @OneToOne(() => Profile, (profile) => profile.user, { eager: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Exclude()
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Exclude()
  @Column({ name: 'created_at' })
  createdAt: number;

  @Exclude()
  @Column({ name: 'updated_at', nullable: true })
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
