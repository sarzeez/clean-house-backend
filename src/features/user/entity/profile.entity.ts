import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

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
  photo: string;

  @Column({ default: null })
  age: number;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
