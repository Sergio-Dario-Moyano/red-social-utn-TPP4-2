import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const puerto = process.env.PORT || 3000;
  await app.listen(puerto);
  console.log(`Servidor corriendo en: http://localhost:${puerto}/api`);
}
bootstrap();









// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module.js';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// await bootstrap();
