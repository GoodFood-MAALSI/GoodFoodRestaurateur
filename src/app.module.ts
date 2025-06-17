import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './domain/restaurant/restaurant.module';
import { RestaurantTypeModule } from './domain/restaurant_type/restaurant_type.module';
import { DatabaseModule } from './database/databas.module';
import { MenuItemsModule } from './domain/menu_items/menu_items.module';
import { MenuCategoriesModule } from './domain/menu_categories/menu_categories.module';
import { MenuItemOptionsModule } from './domain/menu_item_options/menu_item_options.module';
import { MenuItemOptionValuesModule } from './domain/menu_item_option_values/menu_item_option_values.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { SessionModule } from './domain/session/session.module';
import { MailerModule } from './domain/mailer/mailer.module';
import { MailsModule } from './domain/mails/mails.module';
import { ForgotPasswordModule } from './domain/forgot-password/forgot-password.module';
import { UsersModule } from './domain/users/users.module';
import { ClientReviewRestaurantModule } from './domain/client-review-restaurant/client-review-restaurant.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    SessionModule,
    MailerModule,
    MailsModule,
    ForgotPasswordModule,
    UsersModule,
    RestaurantModule,
    RestaurantTypeModule,
    MenuItemsModule,
    MenuCategoriesModule,
    MenuItemOptionsModule,
    MenuItemOptionValuesModule,
    ClientReviewRestaurantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
