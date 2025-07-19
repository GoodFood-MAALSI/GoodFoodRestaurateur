import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';
import { MenuItemOptionValue } from './entities/menu_item_option_value.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class MenuItemOptionValuesService {
  constructor(
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  private async checkRestaurantAccess(
    menuItemOptionId: number,
    userId: number,
  ): Promise<void> {
    const menuItemOption = await this.menuItemOptionRepository.findOne({
      where: { id: menuItemOptionId },
      relations: ['menuItem'],
    });

    if (!menuItemOption) {
      throw new NotFoundException(
        `Menu item option avec l'ID ${menuItemOptionId} non trouvé.`,
      );
    }

    const menuItem = await this.menuItemRepository.findOne({
      where: { id: menuItemOption.menuItemId },
      relations: ['menuCategory'],
    });

    if (!menuItem) {
      throw new NotFoundException(
        `Menu item avec l'ID ${menuItemOption.menuItemId} non trouvé.`,
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

  async create(
    createMenuItemOptionValueDto: CreateMenuItemOptionValueDto,
    userId: number,
  ): Promise<MenuItemOptionValue> {
    await this.checkRestaurantAccess(createMenuItemOptionValueDto.menuItemOptionId, userId);

    const menuItemOptionValue = this.menuItemOptionValueRepository.create(
      createMenuItemOptionValueDto,
    );
    return await this.menuItemOptionValueRepository.save(menuItemOptionValue);
  }

  async findOne(id: number): Promise<MenuItemOptionValue> {
    const optionValue = await this.menuItemOptionValueRepository.findOne({
      where: { id },
    });
    if (!optionValue) {
      throw new NotFoundException(`Menu item option value avec l'ID ${id} non trouvé`);
    }
    return optionValue;
  }

  async update(
    id: number,
    dto: UpdateMenuItemOptionValueDto,
    userId: number,
  ): Promise<MenuItemOptionValue> {
    const existing = await this.menuItemOptionValueRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Menu item option value avec l'ID ${id} non trouvé`);
    }

    await this.checkRestaurantAccess(existing.menuItemOptionId, userId);

    if (dto.position !== undefined && dto.position !== existing.position) {
      const conflict = await this.menuItemOptionValueRepository.findOne({
        where: {
          menuItemOptionId: existing.menuItemOptionId,
          position: dto.position,
        },
      });

      if (conflict && conflict.id !== id) {
        throw new BadRequestException(
          `La position ${dto.position} est déjà utilisée pour cette option de menu.`,
        );
      }
    }

    const updated = await this.menuItemOptionValueRepository.preload({
      id,
      ...dto,
    });

    if (!updated) {
      throw new NotFoundException(
        `Menu item option value avec l'ID ${id} introuvable après preload`,
      );
    }

    return this.menuItemOptionValueRepository.save(updated);
  }

  async remove(id: number, userId: number): Promise<void> {
    const menuItemOptionValue = await this.menuItemOptionValueRepository.findOne({
      where: { id },
    });
    if (!menuItemOptionValue) {
      throw new NotFoundException(
        `Menu item option value avec l'ID ${id} non trouvé.`,
      );
    }

    await this.checkRestaurantAccess(menuItemOptionValue.menuItemOptionId, userId);

    await this.menuItemOptionValueRepository.remove(menuItemOptionValue);
  }
}