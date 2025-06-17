import 'dotenv/config';
import { runSeeders } from 'typeorm-extension';
import AppDataSource from './data-source';
import { UserSeeder } from './seeders/user.seeder';
import { RestaurantTypeSeeder } from './seeders/restaurant_type.seeder';
import { RestaurantSeeder } from './seeders/restaurant.seeder';
import { MenuCategorySeeder } from './seeders/menu_categories.seeder';
import { MenuItemSeeder } from './seeders/menu_items.seeder';
import { MenuItemOptionSeeder } from './seeders/menu_item_options.seeder';
import { MenuItemOptionValueSeeder } from './seeders/menu_item_option_values.seeder';
import { ClientReviewRestaurantSeeder } from './seeders/client-review-restaurant.seeder';

async function seed() {
  try {
    await AppDataSource.initialize();
    await runSeeders(AppDataSource, {
      seeds: [
        UserSeeder,
        RestaurantTypeSeeder,
        RestaurantSeeder,
        MenuCategorySeeder,
        MenuItemSeeder,
        MenuItemOptionSeeder,
        MenuItemOptionValueSeeder,
        ClientReviewRestaurantSeeder
      ],
    });
    await AppDataSource.destroy();
  } catch (err) {
    process.exit(1);
  }
}

seed();