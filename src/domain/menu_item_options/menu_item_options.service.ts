import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class MenuItemOptionsService {
  constructor(
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  private async checkRestaurantAccess(
    menuItemId: number,
    userId: number,
  ): Promise<void> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: menuItemId },
      relations: ['menuCategory'],
    });

    if (!menuItem) {
      throw new NotFoundException(
        `Menu item avec l'ID ${menuItemId} non trouvé.`,
      );
    }

    const menuCategory = await this.menuCategoryRepository.findOne({
      where: { id: menuItem.menuCategoryId },
      relations: ['restaurant'],
    });

    if (!menuCategory) {
      throw new NotFoundException(
        `Catégorie de menu avec l'ID ${menuItem.menuCategoryId} non trouvée.`,
      );
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: menuCategory.restaurantId, userId },
    });

    if (!restaurant) {
      throw new ForbiddenException("Vous n'avez pas accès à ce restaurant.");
    }
  }

  async create(createMenuItemOptionDto: CreateMenuItemOptionDto, userId: number): Promise<MenuItemOption> {
    await this.checkRestaurantAccess(createMenuItemOptionDto.menuItemId, userId);

    const menuItemOption = this.menuItemOptionRepository.create(
      createMenuItemOptionDto,
    );
    return await this.menuItemOptionRepository.save(menuItemOption);
  }

  async update(id: number, dto: UpdateMenuItemOptionDto, userId: number): Promise<MenuItemOption> {
    const existing = await this.menuItemOptionRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Menu item option avec l'ID ${id} non trouvé.`);
    }

    await this.checkRestaurantAccess(existing.menuItemId, userId);

    if (dto.position !== undefined && dto.position !== existing.position) {
      const conflict = await this.menuItemOptionRepository.findOne({
        where: {
          menuItemId: existing.menuItemId,
          position: dto.position,
        },
      });

      if (conflict && conflict.id !== id) {
        throw new BadRequestException(
          `La position ${dto.position} est déjà utilisée pour ce menu item.`,
        );
      }
    }

    const updated = await this.menuItemOptionRepository.preload({
      id,
      ...dto,
    });

    if (!updated) {
      throw new NotFoundException(
        `Menu item option avec l'ID ${id} introuvable après preload.`,
      );
    }

    return this.menuItemOptionRepository.save(updated);
  }

  async remove(id: number, userId: number): Promise<void> {
    const menuItemOption = await this.menuItemOptionRepository.findOne({
      where: { id },
    });
    if (!menuItemOption) {
      throw new NotFoundException(
        `Menu item option avec l'ID ${id} non trouvé.`,
      );
    }

    await this.checkRestaurantAccess(menuItemOption.menuItemId, userId);

    await this.menuItemOptionValueRepository.delete({
      menuItemOptionId: menuItemOption.id,
    });

    await this.menuItemOptionRepository.remove(menuItemOption);
  }
}
