import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]),TypeOrmModule.forFeature([MenuCategory]),TypeOrmModule.forFeature([RestaurantType])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
