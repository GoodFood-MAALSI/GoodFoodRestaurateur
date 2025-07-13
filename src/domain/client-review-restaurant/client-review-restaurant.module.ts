import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsEntityExistsConstraint } from '../utils/validators/is-entity-exists.validator';
import { ClientReviewRestaurant } from './entities/client-review-restaurant.entity';
import { ClientReviewRestaurantController } from './client-review-restaurant.controller';
import { ClientReviewRestaurantService } from './client-review-restaurant.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { InterserviceService } from '../interservice/interservice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientReviewRestaurant]),
    HttpModule,
    UsersModule
  ],
  controllers: [ClientReviewRestaurantController],
  providers: [IsEntityExistsConstraint, ClientReviewRestaurantService, InterserviceService],
})
export class ClientReviewRestaurantModule {}