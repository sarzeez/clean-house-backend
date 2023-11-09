import { Note } from '@/features/note/entity/note.entity';
import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Category {
  CATEGORY_CLEANING = 'cleaning',
  CATEGORY_DISINFECTION = 'disinfection',
  CATEGORY_WASHING = 'washing',
  CATEGORY_KITCHEN = 'kitchen',
  CATEGORY_GREEN_AREA = 'grean_area',
}

@Entity('employ')
export class Employ {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'category',
    type: 'enum',
    enum: Category,
    nullable: true,
  })
  category: Category;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ name: 'created_by' })
  createdBy: number;

  @OneToMany(() => Note, (note) => note.employ)
  notes: Note[];

  @Exclude()
  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Exclude()
  @Column({ name: 'created_at' })
  createdAt: number;

  @Exclude()
  @Column({ name: 'updated_at', nullable: true })
  updatedAt: number;
}
