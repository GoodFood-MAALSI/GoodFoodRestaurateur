import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './domain/utils/filters/http-exception.filter';
import { ResponseInterceptor } from './domain/utils/interceptors/response.interceptor';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { runSeeders } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserSeeder } from './database/seeders/user.seeder';
import { RestaurantTypeSeeder } from './database/seeders/restaurant_type.seeder';
import { RestaurantSeeder } from './database/seeders/restaurant.seeder';
import { MenuCategorySeeder } from './database/seeders/menu_categories.seeder';
import { MenuItemSeeder } from './database/seeders/menu_items.seeder';
import { MenuItemOptionSeeder } from './database/seeders/menu_item_options.seeder';
import { MenuItemOptionValueSeeder } from './database/seeders/menu_item_option_values.seeder';
import { ClientReviewRestaurantSeeder } from './database/seeders/client-review-restaurant.seeder';
import { ImagesSeeder } from './database/seeders/images.seeder';
import * as fs from 'fs/promises';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const allowedOrigins = ['http://localhost:4002', 'http://localhost:8080'];

  // Activer CORS avec les bonnes options
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Pipe de validation global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
    }),
  );

  // Format des réponses/exceptions
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Restaurateur Documentation')
    .setDescription("Documentation de l'API Restaurateur NestJS avec Swagger")
    .setVersion('1.0')
    .addServer(process.env.BACKEND_DOMAIN, 'Local dev')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Configuration pour servir les fichiers statiques (vos images)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Exécuter les seeders en environnement de développement si nécessaire
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.RUN_SEEDERS === 'true'
  ) {
    const seedFilePath = join(__dirname, '.seeded');
    let hasBeenSeeded = false;

    // Vérifier si le fichier .seeded existe
    try {
      await fs.access(seedFilePath);
      hasBeenSeeded = true;
      console.log('Seeders already executed, skipping...');
    } catch {
      // Le fichier n'existe pas, les seeders n'ont pas encore été exécutés
      hasBeenSeeded = false;
    }

    if (!hasBeenSeeded) {
      console.log('Running database seeders for client API...');
      const dataSource = app.get(DataSource);
      try {
        await runSeeders(dataSource, {
          seeds: [
            UserSeeder,
            RestaurantTypeSeeder,
            RestaurantSeeder,
            MenuCategorySeeder,
            MenuItemSeeder,
            MenuItemOptionSeeder,
            MenuItemOptionValueSeeder,
            ClientReviewRestaurantSeeder,
            ImagesSeeder,
          ],
        });
        console.log('Seeders executed successfully for client API.');

        // Créer le fichier .seeded pour marquer l'exécution
        await fs.writeFile(
          seedFilePath,
          'Seeded on ' + new Date().toISOString(),
        );
      } catch (error) {
        console.error('Error running seeders for client API:', error);
        throw error;
      }
    }
  }

  // Démarrage du serveur
  await app.listen(process.env.APP_PORT);
}

bootstrap();
