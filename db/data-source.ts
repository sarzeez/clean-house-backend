import { Employ } from '@/features/employ/entity/employ.entity';
import { File } from '@/features/file/entity/file.entity';
import { Note } from '@/features/note/entity/note.entity';
import { Profile } from '@/features/user/entity/profile.entity';
import { User } from '@/features/user/entity/user.entity';
import { config } from 'dotenv';
config({ path: '.env.local' });

import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Profile, Employ, Note, File],
  synchronize: true,
};
