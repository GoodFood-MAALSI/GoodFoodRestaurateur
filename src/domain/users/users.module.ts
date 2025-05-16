import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Session } from '../session/entities/session.entity'; // Importer l'entité Session

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Restaurant, Session]), // Ajouter Session ici
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    TypeOrmModule.forFeature([User]),
    UsersService,
  ],
})
export class UsersModule {}