import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { DatabaseModule } from 'src/database/databas.module';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
