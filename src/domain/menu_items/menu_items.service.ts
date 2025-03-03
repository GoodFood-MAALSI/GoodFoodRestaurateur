import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { MenuItem } from './entities/menu_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly MenuItemRepository: Repository<MenuItem>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = this.MenuItemRepository.create(createMenuItemDto)
    return await this.MenuItemRepository.save(menuItem);
  }

  async findAll() {
    return await this.MenuItemRepository.find();
  }

  async findOne(id: number) {
    return await this.MenuItemRepository.findOne({ where: {id}});
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {

    const menuItem = await this.findOne(id);

    if(!menuItem){
      throw new NotFoundException();
    }

    Object.assign(menuItem,updateMenuItemDto);
    return await this.MenuItemRepository.save(menuItem);
  }

  async remove(id: number) {
    const menuItem = await this.findOne(id);

    if(!menuItem){
      throw new NotFoundException();
    }
    return await this.MenuItemRepository.remove(menuItem);
  }
}
