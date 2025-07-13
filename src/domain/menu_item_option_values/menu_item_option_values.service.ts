import { BadRequestException, Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';
import { MenuItemOptionValue } from './entities/menu_item_option_value.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuItemOptionValuesService {
  constructor(
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
  ) {}

  async create(createMenuItemOptionValueDto: CreateMenuItemOptionValueDto) {
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

  async update(id: number, dto: UpdateMenuItemOptionValueDto): Promise<MenuItemOptionValue> {
    const existing = await this.menuItemOptionValueRepository.findOne({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Menu item option value with ID ${id} not found`);
    }

    if (dto.position !== undefined && dto.position !== existing.position) {
      const conflict = await this.menuItemOptionValueRepository.findOne({
        where: {
          menuItemOptionId: existing.menuItemOptionId,
          position: dto.position,
        },
      });

      if (conflict && conflict.id !== id) {
        throw new BadRequestException(
          `La position ${dto.position} est déjà utilisée pour cette item option value.`,
        );
      }
    }

    const updated = await this.menuItemOptionValueRepository.preload({
      id,
      ...dto,
    });

    if (!updated) {
      throw new NotFoundException(
        `Menu item option value with ID ${id} not found after preload`,
      );
    }

    return this.menuItemOptionValueRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const menuItemOptionValue = await this.menuItemOptionValueRepository.findOne({
      where: { id },
    });
    if (!menuItemOptionValue) {
      throw new NotFoundException(
        `Menu item option value avec l'ID ${id} non trouvé.`,
      );
    }
    await this.menuItemOptionValueRepository.remove(menuItemOptionValue);
  }
}