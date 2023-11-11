import { Profile } from '@/features/user/entity/profile.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @OneToOne(() => Profile, (profile) => profile.avatar)
  profile: Profile;

  @Exclude()
  @Column({ name: 'created_at' })
  createdAt: number;

  @Exclude()
  @Column({ name: 'updated_at', nullable: true })
  updatedAt: number;
}
