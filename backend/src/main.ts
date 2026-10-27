import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
  // Asegurar físicamente la carpeta de uploads antes del booteo de NestJS en Render
  const uploadsDir = join(process.cwd(), 'uploads');
  const perfilesDir = join(uploadsDir, 'perfiles');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(perfilesDir)) {
    fs.mkdirSync(perfilesDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS dinámico: admite localhost y cualquier URL de Vercel
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);

      const esValido =
        origin.startsWith('http://localhost') ||
        origin.endsWith('.vercel.app') ||
        origin === 'https://red-social-utn-tpp-4-2.vercel.app';

      if (esValido) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback para no bloquear preflights en despliegues preview
      }
    },
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

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor UTN-BUGS corriendo en puerto: ${port}`);
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


