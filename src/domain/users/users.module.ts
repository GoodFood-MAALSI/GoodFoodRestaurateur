import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Session } from '../session/entities/session.entity';
import { InterserviceAuthGuard } from '../interservice/guards/interservice-auth.guard';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Restaurant, Session]),
    HttpModule
  ],
  controllers: [UsersController],
  providers: [UsersService, InterserviceAuthGuard],
  exports: [
    TypeOrmModule.forFeature([User]),
    UsersService,
  ],
})
export class UsersModule {}