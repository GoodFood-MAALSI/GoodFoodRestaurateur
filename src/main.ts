import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './domain/utils/filters/http-exception.filter';
import { ResponseInterceptor } from './domain/utils/interceptors/response.interceptor';
import { join } from 'path'; // Pour joindre les chemins
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config(); // Charge le fichier .env en tout début

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Activer CORS avec les bonnes options
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Pipe de validation global
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Format des réponses/exceptions
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription("Documentation de l'API NestJS avec Swagger")
    .setVersion('1.0')
    .addTag("App", "Point d'entrée de l'api")
    .addServer(process.env.BACKEND_DOMAIN, 'Local dev')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

    // Configuration pour servir les fichiers statiques (vos images)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // Les images seront accessibles via /uploads/images/mon-image.jpg
  });

  // Démarrage du serveur
  await app.listen(process.env.APP_PORT);
}
bootstrap();
