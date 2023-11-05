import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// modules
import { FileModule } from './features/file/module/file.module';

@Module({
  imports: [FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
