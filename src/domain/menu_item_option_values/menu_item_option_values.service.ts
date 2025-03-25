import { Injectable, NotFoundException } from '@nestjs/common';
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
     const menuItemOptionValue = this.menuItemOptionValueRepository.create(createMenuItemOptionValueDto)
     return await this.menuItemOptionValueRepository.save(menuItemOptionValue);
   }
 
   async findAll() {
     return await this.menuItemOptionValueRepository.find();
   }
 
   async findOne(id: number): Promise<MenuItemOptionValue> {
     const menuItemOptionValue = await this.menuItemOptionValueRepository.findOne({ where: { id } });
 
     if (!menuItemOptionValue) {
       throw new NotFoundException(`MenuItemOptionValue with ID ${id} not found`);
     }
 
     return menuItemOptionValue;
   }
 
   async update(id: number, updatemenuItemOptionValueDto: UpdateMenuItemOptionValueDto) {
 
     const menuItemOptionValue = await this.findOne(id);
 
     if(!menuItemOptionValue){
       throw new NotFoundException();
     }
 
     Object.assign(menuItemOptionValue,updatemenuItemOptionValueDto);
     return await this.menuItemOptionValueRepository.save(menuItemOptionValue);
   }
 
   async remove(id: number) {
     const menuItemOptionValue = await this.findOne(id);
 
     if(!menuItemOptionValue){
       throw new NotFoundException();
     }
     return await this.menuItemOptionValueRepository.remove(menuItemOptionValue);
   }
}
