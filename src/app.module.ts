import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from '@db/data-source';

// modules
import { FileModule } from './features/file/module/file.module';
import { UserModule } from './features/user/module/user.module';
import { AuthModule } from './features/auth/module/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.local' }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    FileModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
