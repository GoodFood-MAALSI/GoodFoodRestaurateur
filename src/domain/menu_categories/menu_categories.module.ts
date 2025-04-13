import { Module } from '@nestjs/common';
import { MenuCategoriesService } from './menu_categories.service';
import { MenuCategoriesController } from './menu_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuCategory } from './entities/menu_category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory]),TypeOrmModule.forFeature([MenuItem])],
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService],
})
export class MenuCategoriesModule {}
