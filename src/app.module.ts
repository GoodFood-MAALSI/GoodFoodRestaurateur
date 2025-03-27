import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './domain/restaurant/restaurant.module';
import { RestaurantTypeModule } from './domain/restaurant_type/restaurant_type.module';
import { UsersModule } from './domain/users/users.module';
import { DatabaseModule } from './database/databas.module';
import { MenuItemsModule } from './domain/menu_items/menu_items.module';
import { MenuCategoriesModule } from './domain/menu_categories/menu_categories.module';
import { MenuItemOptionsModule } from './domain/menu_item_options/menu_item_options.module';
import { MenuItemOptionValue } from './domain/menu_item_option_values/entities/menu_item_option_value.entity';
import { MenuItemOptionValuesModule } from './domain/menu_item_option_values/menu_item_option_values.module';
import { TestingModule } from '@nestjs/testing';

@Module({
  imports: [DatabaseModule,RestaurantModule,RestaurantTypeModule,UsersModule,MenuItemsModule,MenuCategoriesModule,MenuItemOptionsModule,MenuItemOptionValuesModule,TestingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
