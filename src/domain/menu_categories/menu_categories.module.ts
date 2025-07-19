import { Module } from '@nestjs/common';
import { MenuCategoriesService } from './menu_categories.service';
import { MenuCategoriesController } from './menu_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory } from './entities/menu_category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { User } from '../users/entities/user.entity';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { IsPositionUniqueCreateMenuCategoryConstraint } from './decorators/is-position-unique-create-menu-category.validator';
import { Images } from '../images/entities/images.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { InterserviceAuthGuard } from '../interservice/guards/interservice-auth.guard';

@Module({
    imports: [
    TypeOrmModule.forFeature([MenuCategory, MenuItem, User, Restaurant, RestaurantType, MenuItemOption, MenuItemOptionValue,Images]),
    RestaurantModule,
    HttpModule,
    UsersModule
  ],
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService, IsPositionUniqueCreateMenuCategoryConstraint, InterserviceAuthGuard],
  exports: [IsPositionUniqueCreateMenuCategoryConstraint],
})
export class MenuCategoriesModule {}