import { Module } from '@nestjs/common';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { MenuItemOptionValuesController } from './menu_item_option_values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from './entities/menu_item_option_value.entity';
import { IsPositionUniqueCreateMenuItemOptionValueConstraint } from './decorators/is-position-unique-create-menu-item-option-value.validator';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemOption]),TypeOrmModule.forFeature([MenuItemOptionValue])],
  controllers: [MenuItemOptionValuesController],
  providers: [MenuItemOptionValuesService, IsPositionUniqueCreateMenuItemOptionValueConstraint],
  exports: [IsPositionUniqueCreateMenuItemOptionValueConstraint],
})
export class MenuItemOptionValuesModule {}
