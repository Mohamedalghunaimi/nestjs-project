/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin:["http://localhost:3000"]
  });
  const config = new DocumentBuilder()
  .setTitle("my api")
  .setDescription("api documentation")
  .setVersion("1.0")
  .setTermsOfService("http://localhost:5000/terms-of-services")
  .addServer("http://localhost:5000")
  .setLicense("mti liccens","https://google.com")
  .addSecurity("bearer",{type:"http",scheme:"bearer"})
  .addBearerAuth()
  .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(5000);
}
bootstrap();
