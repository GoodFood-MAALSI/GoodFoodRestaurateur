import { Module } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { RestaurantTypeController } from './restaurant_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantType } from './entities/restaurant_type.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantType])],
  controllers: [RestaurantTypeController],
  providers: [RestaurantTypeService],
})
export class RestaurantTypeModule {}
