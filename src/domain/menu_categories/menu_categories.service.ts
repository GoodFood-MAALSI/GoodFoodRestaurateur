import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuCategoryDto } from './dto/create-menu_category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu_category.dto';
import { MenuCategory } from './entities/menu_category.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';

@Injectable()
export class MenuCategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
  ) {}

  async create(dto: CreateMenuCategoryDto): Promise<MenuCategory> {
    const menuCategory = this.menuCategoryRepository.create(dto);
    return this.menuCategoryRepository.save(menuCategory);
  }

  async update(id: number, dto: UpdateMenuCategoryDto): Promise<MenuCategory> {
    const existing = await this.menuCategoryRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Menu category with ID ${id} not found`);
    }

    if (dto.position !== undefined && dto.position !== existing.position) {
      const conflict = await this.menuCategoryRepository.findOne({
        where: {
          restaurantId: existing.restaurantId,
          position: dto.position,
        },
      });

      if (conflict && conflict.id !== id) {
        throw new BadRequestException(
          `La position ${dto.position} est déjà utilisée pour ce restaurant.`,
        );
      }
    }

    const updated = await this.menuCategoryRepository.preload({
      id,
      ...dto,
    });

    if (!updated) {
      throw new NotFoundException(
        `Menu category with ID ${id} not found after preload`,
      );
    }

    return this.menuCategoryRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const menuCategory = await this.menuCategoryRepository.findOne({
      where: { id },
    });
    if (!menuCategory) {
      throw new NotFoundException(`Category avec l'ID ${id} non trouvé.`);
    }

    const menuItems = await this.menuItemRepository.find({
      where: { menuCategoryId: menuCategory.id },
    });

    for (const menuItem of menuItems) {
      const menuItemOptions = await this.menuItemOptionRepository.find({
        where: { menuItemId: menuItem.id },
      });

      for (const menuItemOption of menuItemOptions) {
        await this.menuItemOptionValueRepository.delete({
          menuItemOptionId: menuItemOption.id,
        });
      }

      await this.menuItemOptionRepository.delete({
        menuItemId: menuItem.id,
      });
    }

    await this.menuItemRepository.delete({
      menuCategoryId: menuCategory.id,
    });

    await this.menuCategoryRepository.remove(menuCategory);
  }
}
