import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Restaurant])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    TypeOrmModule.forFeature([User]),
    UsersService,
  ],
})
export class UsersModule {}