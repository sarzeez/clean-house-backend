import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './features/auth/guard/jwt-auth.guard';
import { RolesGuard } from './features/auth/guard/roles.guard';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // cors config
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // set global prefix
  app.setGlobalPrefix('api/v1');

  // global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // global auth
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // roles guard
  app.useGlobalGuards(new RolesGuard(reflector));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const PORT = 3000;
  await app.listen(process.env.PORT || PORT);
}
bootstrap();
