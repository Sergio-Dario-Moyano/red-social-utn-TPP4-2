import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parseo de cookies para los interceptores y guards de autenticación
  app.use(cookieParser());

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de CORS estricta para Vercel y entorno local
  app.enableCors({
    origin: [
      'https://red-social-utn-tpp-4-2.vercel.app',
      'http://localhost:4200',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  });

  // Prefijo global para todos los endpoints
  app.setGlobalPrefix('api');

  // Render asigna dinámicamente la variable PORT
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();














// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module.js';
// import { ValidationPipe } from '@nestjs/common';
// import cookieParser from 'cookie-parser';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.setGlobalPrefix('api');

//   app.use(cookieParser());

//   app.enableCors({
//     origin: 'http://localhost:4200',
//     credentials: true,
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   app.enableCors({
//     origin: [
//       'http://localhost:4200',
//       'https://red-social-utn-tpp-4-2.vercel.app'
//       // 'https://tu-proyecto.vercel.app' // Poné tu URL exacta de Vercel sin barra al final
//     ],
//     credentials: true,
//   });

//   const puerto = process.env.PORT || 3000;
//   await app.listen(puerto);
//   console.log(`Servidor corriendo en: http://localhost:${puerto}/api`);
// }
// bootstrap();


