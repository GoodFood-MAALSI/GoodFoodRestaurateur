import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';

@Injectable()
export class MenuItemOptionsService {
  constructor(
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
  ) {}

  async create(createMenuItemOptionDto: CreateMenuItemOptionDto) {
    const menuItemOption = this.menuItemOptionRepository.create(
      createMenuItemOptionDto,
    );
    return await this.menuItemOptionRepository.save(menuItemOption);
  }
  
  async update(id: number, dto: UpdateMenuItemOptionDto): Promise<MenuItemOption> {
      const existing = await this.menuItemOptionRepository.findOne({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Menu item option with ID ${id} not found`);
      }
  
      if (dto.position !== undefined && dto.position !== existing.position) {
        const conflict = await this.menuItemOptionRepository.findOne({
          where: {
            menuItemId: existing.menuItemId,
            position: dto.position,
          },
        });
  
        if (conflict && conflict.id !== id) {
          throw new BadRequestException(
            `La position ${dto.position} est déjà utilisée pour cette item option.`,
          );
        }
      }
  
      const updated = await this.menuItemOptionRepository.preload({
        id,
        ...dto,
      });
  
      if (!updated) {
        throw new NotFoundException(
          `Menu item option with ID ${id} not found after preload`,
        );
      }
  
      return this.menuItemOptionRepository.save(updated);
    }

  async remove(id: number): Promise<void> {
    const menuItemOption = await this.menuItemOptionRepository.findOne({
      where: { id },
    });
    if (!menuItemOption) {
      throw new NotFoundException(
        `Menu item option avec l'ID ${id} non trouvé.`,
      );
    }
    await this.menuItemOptionValueRepository.delete({
      menuItemOptionId: menuItemOption.id,
    });

    await this.menuItemOptionRepository.remove(menuItemOption);
  }
}
