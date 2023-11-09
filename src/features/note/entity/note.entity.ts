import { Employ } from '@/features/employ/entity/employ.entity';
import { User } from '@/features/user/entity/user.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

@Entity('note')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  rating: Rating;

  @ManyToOne(() => Employ, (employ) => employ.notes, { eager: true })
  @JoinColumn({ name: 'employ_id' })
  employ: Employ;

  @ManyToOne(() => User, (user) => user.notes, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Exclude()
  @Column({ name: 'created_at' })
  createdAt: number;

  @Exclude()
  @Column({ name: 'updated_at', nullable: true })
  updatedAt: number;
}
