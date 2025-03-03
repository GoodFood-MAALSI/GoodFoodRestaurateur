import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/databas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
