import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
  // Asegurar físicamente la carpeta de uploads al iniciar en Render
  const uploadDir = join(process.cwd(), 'uploads', 'perfiles');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
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

  // CORS con soporte para cualquier URL de Vercel y localhost
  app.enableCors({
    origin: (origin:any, callback:any) => {
      if (!origin) return callback(null, true);
      const esValido =
        origin.startsWith('http://localhost') ||
        /\.vercel\.app$/.test(new URL(origin).hostname);

      if (esValido) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por CORS: ' + origin));
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
  console.log(`🚀 Servidor listo en puerto ${port}`);
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


