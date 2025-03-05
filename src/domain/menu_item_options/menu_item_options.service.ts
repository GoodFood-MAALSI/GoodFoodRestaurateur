import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { MenuItemOption } from './entities/menu_item_option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MenuItemOptionsService {
    constructor(
      @InjectRepository(MenuItemOption)
      private readonly menuItemOptionRepository: Repository<MenuItemOption>,
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
}
