import { Module } from '@nestjs/common';
import { MenuItemOptionsService } from './menu_item_options.service';
import { MenuItemOptionsController } from './menu_item_options.controller';
import { DatabaseModule } from 'src/database/databas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([MenuItemOption]),TypeOrmModule.forFeature([MenuItem])],
  controllers: [MenuItemOptionsController],
  providers: [MenuItemOptionsService],
})
export class MenuItemOptionsModule {}
