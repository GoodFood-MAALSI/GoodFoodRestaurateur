import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { MenuItem } from './entities/menu_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { CreateMenuItemOptionDto } from '../menu_item_options/dto/create-menu_item_option.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = this.menuItemRepository.create(createMenuItemDto)
    return await this.menuItemRepository.save(menuItem);
  }

  async findAll() {
    return await this.menuItemRepository.find();
  }

  async findOne(id: number) {
    const menuItem = await this.menuItemRepository.findOne({ where: { id } });

    if (!menuItem) {
      throw new NotFoundException(`MenuItem with ID ${id} not found`);
    }

    return menuItem;
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {

    const menuItem = await this.findOne(id);

    if(!menuItem){
      throw new NotFoundException();
    }

    Object.assign(menuItem,updateMenuItemDto);
    return await this.menuItemRepository.save(menuItem);
  }

  async remove(id: number) {
    const menuItem = await this.findOne(id);

    if(!menuItem){
      throw new NotFoundException();
    }
    return await this.menuItemRepository.remove(menuItem);
  }

  async getMenuOptionsByMenuItemId(menuItemId: number): Promise<MenuItemOption[]> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: menuItemId },
      relations: ['menuItemOptions'],
    });

    if (!menuItem) {
      throw new NotFoundException(`MenuItemId avec l'ID ${menuItemId} non trouvé`);
    }

    return menuItem.menu_item_options;
  }

  async addMenuItemOptionToMenuItem(menuItemId: number, createMenuItemOptionDto: CreateMenuItemOptionDto): Promise<MenuItemOption> {
    const menuItem = await this.menuItemRepository.findOne({ where: { id: menuItemId } });

    if (!menuItem) {
      throw new NotFoundException(`MenuItemId avec l'ID ${menuItemId} non trouvé`);
    }

    const menuItemOption = this.menuItemOptionRepository.create({
      ...createMenuItemOptionDto,
      menu_item: menuItem,
    });

    return this.menuItemOptionRepository.save(menuItemOption);
  }
}
