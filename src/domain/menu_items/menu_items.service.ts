import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { MenuItem } from './entities/menu_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    return await this.menuItemRepository.save(menuItem);
  }

  async update(id: number, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const existing = await this.menuItemRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }

    if (dto.position !== undefined && dto.position !== existing.position) {
      const conflict = await this.menuItemRepository.findOne({
        where: {
          menuCategoryId: existing.menuCategoryId,
          position: dto.position,
        },
      });

      if (conflict && conflict.id !== id) {
        throw new BadRequestException(
          `La position ${dto.position} est déjà utilisée pour cette categorie.`,
        );
      }
    }

    const updated = await this.menuItemRepository.preload({
      id,
      ...dto,
    });

    if (!updated) {
      throw new NotFoundException(
        `Menu item with ID ${id} not found after preload`,
      );
    }

    return this.menuItemRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item avec l'ID ${id} non trouvé.`);
    }

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

    await this.menuItemRepository.remove(menuItem);
  }
}
