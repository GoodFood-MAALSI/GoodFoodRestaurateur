import { Module } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { RestaurantTypeController } from './restaurant_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantType } from './entities/restaurant_type.entity';
import { HttpModule } from '@nestjs/axios';
import { InterserviceAuthGuard } from '../interservice/guards/interservice-auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantType]), HttpModule, UsersModule],
  controllers: [RestaurantTypeController],
  providers: [RestaurantTypeService, InterserviceAuthGuard],
})
export class RestaurantTypeModule {}
