import { Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { CreateMenuCategoryDto } from '../menu_categories/dto/create-menu_category.dto';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { CreateRestaurantTypeDto } from '../restaurant_type/dto/create-restaurant_type.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant_repository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly user_repository: Repository<User>,
  ) {}

  async create(create_restaurant_dto: CreateRestaurantDto) {
    const restaurant = this.restaurant_repository.create(create_restaurant_dto);
    return await this.restaurant_repository.save(restaurant);
  }

  async findAll(
    filters: RestaurantFilterDto,
    page: number,
    limit: number,
  ): Promise<{ restaurants: Restaurant[]; total: number }> {
    const offset = (page - 1) * limit;

    const where: any = {}; // Use 'any' to handle optional properties correctly
    if (filters.name) {
      where.name =  Like(`%${filters.name}%`); // Use LIKE for partial matching
    }
    if (filters.description) {
      where.description = Like(`%${filters.description}%`);
    }
    if (filters.is_open !== undefined && filters.is_open !== null) {
      where.is_open = filters.is_open;
    }
    if (filters.city) {
      where.city = Like(`%${filters.city}%`);
    }
    if (filters.country) {
      where.country = Like(`%${filters.country}%`);
    }

    const [restaurants, total] = await this.restaurant_repository.findAndCount({
      where,
      take: limit,
      skip: offset,
    });

    return { restaurants, total };
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

    async getRestaurantsByUserId(userId: number): Promise<Restaurant[]> {
    const restaurants = await this.restaurant_repository.find({
      where: { user: { id: userId } },
    });
    return restaurants;
  }

    async addUserToRestaurant(
    restaurantId: number,
    userId: number,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id: restaurantId },
      relations: ['user'], // Charger la relation avec l'utilisateur
    });

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`,
      );
    }

    const user = await this.user_repository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    restaurant.user = user; // Assigner l'utilisateur au restaurant
    return await this.restaurant_repository.save(restaurant);
  }
}
