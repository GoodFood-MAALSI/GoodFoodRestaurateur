import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { DatabaseModule } from 'src/database/databas.module';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Restaurant]),TypeOrmModule.forFeature([MenuCategory])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
