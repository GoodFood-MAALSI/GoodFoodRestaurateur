import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { MenuItemsController } from './menu_items.controller';
import { DatabaseModule } from 'src/database/databas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu_item.entity';

@Module({
  imports:[DatabaseModule,TypeOrmModule.forFeature([MenuItem])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
})
export class MenuItemsModule {}
