import { Module } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { RestaurantTypeController } from './restaurant_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantType } from './entities/restaurant_type.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantType]),TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantTypeController],
  providers: [RestaurantTypeService],
})
export class RestaurantTypeModule {}
