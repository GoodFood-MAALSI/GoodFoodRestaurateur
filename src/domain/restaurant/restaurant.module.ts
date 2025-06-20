import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { PaginationService } from './pagination.service';
import { User } from '../users/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Images } from '../images/entities/images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    UsersModule,
    HttpModule,
    TypeOrmModule.forFeature([MenuCategory]),
    TypeOrmModule.forFeature([RestaurantType]),
    TypeOrmModule.forFeature([Images]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, PaginationService],
})
export class RestaurantModule {}
