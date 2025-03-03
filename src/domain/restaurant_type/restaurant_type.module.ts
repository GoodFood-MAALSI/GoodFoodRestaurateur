import { Module } from '@nestjs/common';
import { RestaurantTypeService } from './restaurant_type.service';
import { RestaurantTypeController } from './restaurant_type.controller';
import { DatabaseModule } from 'src/database/databas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantType } from './entities/restaurant_type.entity';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([RestaurantType])],
  controllers: [RestaurantTypeController],
  providers: [RestaurantTypeService],
})
export class RestaurantTypeModule {}
