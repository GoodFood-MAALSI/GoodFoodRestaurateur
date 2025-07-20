import { Module } from '@nestjs/common';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { MenuItemOptionValuesController } from './menu_item_option_values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from './entities/menu_item_option_value.entity';
import { IsPositionUniqueCreateMenuItemOptionValueConstraint } from './decorators/is-position-unique-create-menu-item-option-value.validator';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuItemOptionValue,
      MenuItemOption,
      MenuItem,
      MenuCategory,
      Restaurant,
    ]),
    HttpModule,
    UsersModule,
  ],
  controllers: [MenuItemOptionValuesController],
  providers: [
    MenuItemOptionValuesService,
    IsPositionUniqueCreateMenuItemOptionValueConstraint,
  ],
  exports: [IsPositionUniqueCreateMenuItemOptionValueConstraint],
})
export class MenuItemOptionValuesModule {}
