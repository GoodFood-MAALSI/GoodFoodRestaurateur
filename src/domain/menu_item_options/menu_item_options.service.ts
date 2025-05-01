import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { CreateMenuItemOptionValueDto } from '../menu_item_option_values/dto/create-menu_item_option_value.dto';

@Injectable()
export class MenuItemOptionsService {
    constructor(
      @InjectRepository(MenuItemOption)
      private readonly menuItemOptionRepository: Repository<MenuItemOption>,
      @InjectRepository(MenuItemOptionValue)
      private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
    ) {}
 
   async create(createMenuItemOptionDto: CreateMenuItemOptionDto) {
     const menuItemOption = this.menuItemOptionRepository.create(createMenuItemOptionDto)
     return await this.menuItemOptionRepository.save(menuItemOption);
   }
 
   async findAll() {
     return await this.menuItemOptionRepository.find();
   }
 
   async findOne(id: number): Promise<MenuItemOption> {
     const menuItemOption = await this.menuItemOptionRepository.findOne({ where: { id } });
 
     if (!menuItemOption) {
       throw new NotFoundException(`MenuItemOption with ID ${id} not found`);
     }
 
     return menuItemOption;
   }
 
   async update(id: number, updatemenuItemOptionDto: UpdateMenuItemOptionDto) {
 
     const menuItemOption = await this.findOne(id);
 
     if(!menuItemOption){
       throw new NotFoundException();
     }
 
     Object.assign(menuItemOption,updatemenuItemOptionDto);
     return await this.menuItemOptionRepository.save(menuItemOption);
   }
 
   async remove(id: number) {
     const menuItemOption = await this.findOne(id);
 
     if(!menuItemOption){
       throw new NotFoundException();
     }
     return await this.menuItemOptionRepository.remove(menuItemOption);
   }

   async getMenuOptionValuessByMenuOptionId(menuItemOptionId: number): Promise<MenuItemOptionValue[]> {
    const menuItemOption = await this.menuItemOptionRepository.findOne({
      where: { id: menuItemOptionId },
      relations: ['menuItemOptionValues'],
    });

    if (!menuItemOption) {
      throw new NotFoundException(`MenuItemId avec l'ID ${menuItemOption} non trouvé`);
    }

    return menuItemOption.menu_item_option_values;
  }

  async addMenuItemOptionValueToMenuItemOption(menuItemOptionId: number, createMenuItemOptionValueDto: CreateMenuItemOptionValueDto): Promise<MenuItemOptionValue> {
    const menuItemOption = await this.menuItemOptionRepository.findOne({ where: { id: menuItemOptionId } });

    if (!menuItemOption) {
      throw new NotFoundException(`MenuItemOptionId avec l'ID ${menuItemOptionId} non trouvé`);
    }

    const menuItemOptionValue = this.menuItemOptionValueRepository.create({
      ...createMenuItemOptionValueDto,
      menu_item_option: menuItemOption,
    });

    return this.menuItemOptionValueRepository.save(menuItemOptionValue);
  }
}
