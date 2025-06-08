import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu_items.service';
import { MenuItemsController } from './menu_items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu_item.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { IsPositionUniqueCreateMenuItemConstraint } from './decorators/is-position-unique-create-menu-items.validator';

@Module({
  imports:[TypeOrmModule.forFeature([MenuItem, MenuCategory, MenuItemOption, MenuItemOptionValue])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService, IsPositionUniqueCreateMenuItemConstraint],
  exports: [IsPositionUniqueCreateMenuItemConstraint],
})
export class MenuItemsModule {}
