/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// إنشاء نسخة من express لاستخدامها كـ Handler
const server = express();

export const createServer = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // نصيحة: خلي الـ CORS مفتوح للكل في البداية للتأكد من الحل
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("my api")
    .setDescription("api documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.init();
  return app;
};

// هذا الجزء هو المهم لـ Vercel
export default async (req: any, res: any) => {
  await createServer(server);
  server(req, res);
};

// عشان تقدر تشغله local عادي
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors();
    await app.listen(5000);
  }
  bootstrap();
}


