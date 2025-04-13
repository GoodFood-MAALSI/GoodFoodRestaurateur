import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { MenuItemsController } from './menu_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu_item.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MenuItem]),TypeOrmModule.forFeature([MenuCategory]),TypeOrmModule.forFeature([MenuItemOption])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
})
export class MenuItemsModule {}
