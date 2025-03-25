import { Module } from '@nestjs/common';
import { MenuItemOptionsService } from './menu_item_options.service';
import { MenuItemOptionsController } from './menu_item_options.controller';
import { DatabaseModule } from 'src/database/databas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';

@Module({
  imports: [DatabaseModule,TypeOrmModule.forFeature([MenuItemOption]),TypeOrmModule.forFeature([MenuItem]),TypeOrmModule.forFeature([MenuItemOptionValue])],
  controllers: [MenuItemOptionsController],
  providers: [MenuItemOptionsService],
})
export class MenuItemOptionsModule {}
