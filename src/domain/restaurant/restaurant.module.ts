import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { User } from '../users/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { IsEntityExistsConstraint } from '../utils/validators/is-entity-exists.validator';
import { IsSiretUniqueConstraint } from './validators/is-siret-unique.validator';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { ClientReviewRestaurant } from '../client-review-restaurant/entities/client-review-restaurant.entity';
import { Images } from '../images/entities/images.entity';
import { InterserviceAuthGuard } from '../interservice/guards/interservice-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, MenuCategory, RestaurantType, User, MenuItem, MenuItemOption, MenuItemOptionValue, ClientReviewRestaurant,Images]),
    UsersModule,
    HttpModule,
  ],
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    IsEntityExistsConstraint,
    IsSiretUniqueConstraint,
    InterserviceAuthGuard
  ],
  exports: [RestaurantService],
})
export class RestaurantModule {}
