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
import * as geolib from 'geolib';

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

    const where: any = {};
    if (filters.name) {
      where.name = Like(`%${filters.name}%`);
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
    if (filters.resturant_type) {
      where.restaurant_type = Like(`%${filters.resturant_type}%`);
    }

    // Récupérer tous les restaurants qui correspondent aux autres filtres
    // sans la pagination et le filtrage de distance pour l'instant.
    // Cela récupérera potentiellement beaucoup de données.
    const allMatchingRestaurants = await this.restaurant_repository.find({ where: where });

    let filteredByDistanceRestaurants = allMatchingRestaurants;

    if (filters.lat && filters.long && filters.perimeter) {
      const centerPoint = { latitude: filters.lat, longitude: filters.long };
      const perimeterMeters = filters.perimeter; // Assurez-vous que le périmètre est en mètres

      filteredByDistanceRestaurants = allMatchingRestaurants.filter(restaurant => {
        // Assurez-vous que le restaurant a aussi des coordonnées
        if (restaurant.lat === undefined || restaurant.long === undefined || restaurant.lat === null || restaurant.long === null) {
          return false; // Ignorer les restaurants sans coordonnées
        }

        const restaurantPoint = { latitude: restaurant.lat, longitude: restaurant.long };
        const distance = geolib.getDistance(centerPoint, restaurantPoint); // Calculer la distance
        console.log("distance"+distance)
        return distance <= perimeterMeters; // Filtrer
      });
    }

    // Appliquer la pagination APRES le filtrage de distance
    const paginatedData = filteredByDistanceRestaurants.slice(offset, offset + limit);
    const total = filteredByDistanceRestaurants.length; // Le total est le nombre après filtrage

    return { restaurants: paginatedData, total };
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
