// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/loggerGlobal';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware global personalizado
  app.use(loggerGlobal);

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Configuración de Swagger (documentación interactiva)
  const config = new DocumentBuilder()
    .setTitle('Postres Saludables API 🍰')
    .setDescription(
      'API REST para la gestión del sistema de ventas en línea **Postres Saludables**. Incluye autenticación con JWT, gestión de usuarios y roles, productos, pedidos, pagos y más. Desarrollada con NestJS y TypeORM.'
    )
    .setVersion('1.0')
    .addBearerAuth() //  para autenticación con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 🚀 Iniciar servidor
  await app.listen(3002);
  console.log('Servidor corriendo en el puerto 3002 🐱');
}

bootstrap();
