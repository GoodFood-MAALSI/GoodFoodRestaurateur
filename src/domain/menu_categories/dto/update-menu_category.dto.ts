import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuCategoryDto } from './create-menu_category.dto';

export class UpdateMenuCategoryDto extends PartialType(CreateMenuCategoryDto) {}
