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

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://red-social-utn-tpp-4-2.vercel.app'
      // 'https://tu-proyecto.vercel.app' // Poné tu URL exacta de Vercel sin barra al final
    ],
    credentials: true,
  });

  const puerto = process.env.PORT || 3000;
  await app.listen(puerto);
  console.log(`Servidor corriendo en: http://localhost:${puerto}/api`);
}
bootstrap();


