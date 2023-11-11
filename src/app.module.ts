import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { dataSourceOptions } from '@db/data-source';

// modules
import { UserModule } from './features/user/module/user.module';
import { AuthModule } from './features/auth/module/auth.module';
import { EmployModule } from './features/employ/module/employ.module';
import { NoteModule } from './features/note/module/note.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './../public'),
      exclude: ['/api/(.*)'],
    }),
    UserModule,
    AuthModule,
    EmployModule,
    NoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
