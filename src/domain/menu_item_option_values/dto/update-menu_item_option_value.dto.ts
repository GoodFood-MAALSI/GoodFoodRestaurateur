import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemOptionValueDto } from './create-menu_item_option_value.dto';

export class UpdateMenuItemOptionValueDto extends PartialType(CreateMenuItemOptionValueDto) {}
