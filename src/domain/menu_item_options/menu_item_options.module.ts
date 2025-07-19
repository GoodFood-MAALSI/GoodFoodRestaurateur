import { Module } from '@nestjs/common';
import { MenuItemOptionsService } from './menu_item_options.service';
import { MenuItemOptionsController } from './menu_item_options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity'; // Ajout
import { Restaurant } from '../restaurant/entities/restaurant.entity'; // Ajout
import { IsPositionUniqueCreateMenuItemOptionConstraint } from './decorators/is-position-unique-create-menu-item-option.validator';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';
import { InterserviceAuthGuard } from '../interservice/guards/interservice-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuItemOption,
      MenuItem,
      MenuItemOptionValue,
      MenuCategory,
      Restaurant,
    ]),
    HttpModule,
    UsersModule,
  ],
  controllers: [MenuItemOptionsController],
  providers: [
    MenuItemOptionsService,
    IsPositionUniqueCreateMenuItemOptionConstraint,
    InterserviceAuthGuard,
  ],
  exports: [IsPositionUniqueCreateMenuItemOptionConstraint],
})
export class MenuItemOptionsModule {}