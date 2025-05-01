import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { CreateMenuCategoryDto } from '../menu_categories/dto/create-menu_category.dto';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { CreateRestaurantTypeDto } from '../restaurant_type/dto/create-restaurant_type.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant_repository: Repository<Restaurant>,
    @InjectRepository(MenuCategory)
    private readonly menu_category_repository: Repository<MenuCategory>,
    @InjectRepository(RestaurantType)
    private readonly restaurant_type_repository: Repository<RestaurantType>,
  ) {}

  async create(create_restaurant_dto: CreateRestaurantDto) {
    const restaurant = this.restaurant_repository.create(create_restaurant_dto)
    return await this.restaurant_repository.save(restaurant);
  }

  async findAll(filters: RestaurantFilterDto): Promise<Restaurant[]> {
    const where: any = {}; // Objet pour construire la clause WHERE dynamiquement

    if (filters.name) {
      where.name = ILike(`%${filters.name}%`); // Utiliser ILike pour une recherche insensible à la casse et partielle
    }
    if (filters.description) {
      where.description = ILike(`%${filters.description}%`);
    }
    if (filters.is_open !== undefined) {
      where.is_open = filters.is_open;
    }
    if (filters.city) {
      where.city = ILike(`%${filters.city}%`);
    }
    if (filters.country) {
      where.country = ILike(`%${filters.country}%`);
    }

    return this.restaurant_repository.find({ where });
  }


  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({ where: { id } });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async update(id: number, update_restaurant_dto: UpdateRestaurantDto) {

    const restaurant = await this.findOne(id);

    if(!restaurant){
      throw new NotFoundException();
    }

    Object.assign(restaurant,update_restaurant_dto);
    return await this.restaurant_repository.save(restaurant);
  }

  async remove(id: number) {
    const restaurant = await this.findOne(id);

    if(!restaurant){
      throw new NotFoundException();
    }
    return await this.restaurant_repository.remove(restaurant);
  }

  async getMenuCategoriesByRestaurantId(restaurant_id: number): Promise<MenuCategory[]> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id: restaurant_id },
      relations: ['menuCategories'],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${restaurant_id} non trouvé`);
    }

    return restaurant.menu_categories;
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

  async addTypeToRestaurant(restaurant_id: number, create_restaurant_type_dto: CreateRestaurantTypeDto): Promise<RestaurantType> {
    const restaurant = await this.restaurant_repository.findOne({ where: { id: restaurant_id }, relations: ['restaurant_type'] }); // Récupérer le restaurant avec la relation restaurantType

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${restaurant_id} non trouvé`);
    }

    let restaurantType = await this.restaurant_type_repository.findOne({
      where: { name: create_restaurant_type_dto.name },
    });

    if (!restaurantType) {
      restaurantType = this.restaurant_type_repository.create({
        name: create_restaurant_type_dto.name,
      });
      restaurantType = await this.restaurant_type_repository.save(restaurantType);
    }

    restaurant.restaurant_type = restaurantType;
    await this.restaurant_repository.save(restaurant);

    restaurantType.restaurants = [...(restaurantType.restaurants || []), restaurant];
    await this.restaurant_type_repository.save(restaurantType);
    return restaurantType;
  }
}
