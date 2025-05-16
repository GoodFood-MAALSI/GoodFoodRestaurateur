import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMenuCategoryDto } from './dto/create-menu_category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu_category.dto';
import { MenuCategory } from './entities/menu_category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { CreateMenuItemDto } from '../menu_items/dto/create-menu_item.dto';
import { User } from '../users/entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class MenuCategoriesService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(Restaurant)
    private readonly restaurant_repository: Repository<Restaurant>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuCategory)
    private readonly menu_category_repository: Repository<MenuCategory>,
    @InjectRepository(User) // Injectez le référentiel User
    private readonly userRepository: Repository<User>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createMenuCategoryDto: CreateMenuCategoryDto) {
    // Récupérer l'utilisateur à partir de la requête
    // const user = this.request.user;

    // if (!user || !user.id) {
    //   throw new UnauthorizedException(
    //     'User not authenticated or user ID not found in request',
    //   );
    // }

    // // Vérifier si l'utilisateur existe en utilisant le référentiel User
    // const userExists = await this.checkUserExists(user.id);

    // if (!userExists) {
    //   throw new NotFoundException(`User with ID ${user.id} not found`);
    // }
    const menuCategorie = this.menuCategoryRepository.create(createMenuCategoryDto);
    return await this.menuCategoryRepository.save(menuCategorie);
  }

  async findAll() {
    return await this.menuCategoryRepository.find();
  }

  async findOne(id: number): Promise<MenuCategory> {
    const menuCategory = await this.menuCategoryRepository.findOne({ where: { id } });

    if (!menuCategory) {
      throw new NotFoundException(`MenuCategory with ID ${id} not found`);
    }

    return menuCategory;
  }

  async update(id: number, updateMenuCategoryDto: UpdateMenuCategoryDto) {

    const menuCategorie = await this.findOne(id);

    if(!menuCategorie){
      throw new NotFoundException();
    }

    Object.assign(menuCategorie,updateMenuCategoryDto);
    return await this.menuCategoryRepository.save(menuCategorie);
  }

  async remove(id: number) {
    const menuCategorie = await this.findOne(id);

    if(!menuCategorie){
      throw new NotFoundException();
    }
    return await this.menuCategoryRepository.remove(menuCategorie);
  }

  async getMenuItemsByMenuCategoryId(menuCategotyId: number): Promise<MenuItem[]> {
    const menuCategory = await this.menuCategoryRepository.findOne({
      where: { id: menuCategotyId },
      relations: ['menuItems'],
    });

    if (!menuCategory) {
      throw new NotFoundException(`MenuCategory avec l'ID ${menuCategotyId} non trouvé`);
    }

    return menuCategory.menu_items;
  }

  async addMenuItemToMenuCategory(menuCategoryId: number, createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const menuCategory = await this.menuCategoryRepository.findOne({ where: { id: menuCategoryId } });

    if (!menuCategory) {
      throw new NotFoundException(`MenuCategory avec l'ID ${menuCategoryId} non trouvé`);
    }

    const menuItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      menu_category: menuCategory,
    });

    return this.menuItemRepository.save(menuItem);
  }

  async addMenuCategoryToRestaurant(restaurant_id: number, create_menu_category_dto: CreateMenuCategoryDto): Promise<MenuCategory> {
    const restaurant = await this.restaurant_repository.findOne({ where: { id: restaurant_id } });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${restaurant_id} non trouvé`);
    }

    const menuCategory = this.menu_category_repository.create({
      ...create_menu_category_dto,
      restaurant: restaurant,
    });

    return this.menu_category_repository.save(menuCategory);
  }
}
