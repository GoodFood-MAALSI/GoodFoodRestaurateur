import { Module } from '@nestjs/common';
import { MenuCategoriesService } from './menu_categories.service';
import { MenuCategoriesController } from './menu_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory } from './entities/menu_category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { User } from '../users/entities/user.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Images } from '../images/entities/images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory]),TypeOrmModule.forFeature([MenuItem]),TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Restaurant]),TypeOrmModule.forFeature([Images])],
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService,RestaurantService],
})
export class MenuCategoriesModule {}
