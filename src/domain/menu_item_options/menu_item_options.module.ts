import { Module } from '@nestjs/common';
import { MenuItemOptionsService } from './menu_item_options.service';
import { MenuItemOptionsController } from './menu_item_options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { IsPositionUniqueCreateMenuItemOptionConstraint } from './decorators/is-position-unique-create-menu-item-option.validator';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemOption, MenuItem, MenuItemOptionValue])],
  controllers: [MenuItemOptionsController],
  providers: [MenuItemOptionsService, IsPositionUniqueCreateMenuItemOptionConstraint],
  exports: [IsPositionUniqueCreateMenuItemOptionConstraint],
})
export class MenuItemOptionsModule {}
