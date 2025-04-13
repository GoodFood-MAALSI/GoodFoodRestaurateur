import { Module } from '@nestjs/common';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { MenuItemOptionValuesController } from './menu_item_option_values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from './entities/menu_item_option_value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemOption]),TypeOrmModule.forFeature([MenuItemOptionValue])],
  controllers: [MenuItemOptionValuesController],
  providers: [MenuItemOptionValuesService],
})
export class MenuItemOptionValuesModule {}
