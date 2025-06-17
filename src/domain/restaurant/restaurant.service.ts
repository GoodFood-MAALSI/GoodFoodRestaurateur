import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { User } from '../users/entities/user.entity';
import * as geolib from 'geolib';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { ClientReviewRestaurant } from '../client-review-restaurant/entities/client-review-restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant_repository: Repository<Restaurant>,
    @InjectRepository(RestaurantType)
    private readonly restaurant_type: Repository<RestaurantType>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
    @InjectRepository(ClientReviewRestaurant)
    private readonly clientReviewRestaurantRepository: Repository<ClientReviewRestaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto & { userId: number }) {
    const { restaurantTypeId, userId, ...restaurantData } = createRestaurantDto;

    const restaurantTypeExists = await this.restaurant_type.existsBy({
      id: restaurantTypeId,
    });

    if (!restaurantTypeExists) {
      throw new NotFoundException(
        `RestaurantType avec l'ID ${restaurantTypeId} non trouvé`,
      );
    }

    const restaurant = this.restaurant_repository.create({
      ...restaurantData,
      restaurantTypeId,
      userId,
    });

    return await this.restaurant_repository.save(restaurant);
  }

  async findAll(
    filters: RestaurantFilterDto,
    page = 1,
    limit = 10,
  ): Promise<{ restaurants: Restaurant[]; total: number }> {
    const where: Record<string, any> = {};

    if (filters.name) {
      where.name = ILike(`%${filters.name}%`);
    }

    if (filters.is_open !== undefined) {
      where.is_open = filters.is_open;
    }

    if (filters.city) {
      where.city = ILike(`%${filters.city}%`);
    }

    if (filters.restaurant_type) {
      where.restaurantTypeId = filters.restaurant_type;
    }

    try {
      const allRestaurants = await this.restaurant_repository.find({
        where,
        relations: ['restaurantType'],
      });

      // Fetch review stats for all restaurants in one query
      const reviewStats = await this.clientReviewRestaurantRepository
        .createQueryBuilder('review')
        .select('review.restaurantId', 'restaurantId')
        .addSelect('COUNT(review.id)', 'review_count')
        .addSelect('AVG(review.rating)', 'average_rating')
        .where('review.restaurantId IN (:...ids)', {
          ids: allRestaurants.map((r) => r.id),
        })
        .groupBy('review.restaurantId')
        .getRawMany();

      // Map review stats to restaurants
      const restaurantsWithStats = allRestaurants.map((restaurant) => {
        const stats = reviewStats.find(
          (s) => s.restaurantId === restaurant.id,
        );
        restaurant.review_count = stats ? parseInt(stats.review_count) : 0;
        restaurant.average_rating = stats
          ? parseFloat(parseFloat(stats.average_rating).toFixed(2))
          : 0;
        return restaurant;
      });

      let filteredRestaurants = restaurantsWithStats;
      if (filters.lat && filters.long && filters.perimeter) {
        const center = { latitude: filters.lat, longitude: filters.long };

        filteredRestaurants = restaurantsWithStats.filter((restaurant) => {
          if (restaurant.lat == null || restaurant.long == null) return false;

          const distance = geolib.getDistance(center, {
            latitude: restaurant.lat,
            longitude: restaurant.long,
          });

          return distance <= filters.perimeter;
        });
      }

      const offset = (page - 1) * limit;
      const paginatedRestaurants = filteredRestaurants.slice(
        offset,
        offset + limit,
      );
      const total = filteredRestaurants.length;

      return { restaurants: paginatedRestaurants, total };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Échec de la récupération des restaurants',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id },
      relations: [
        'restaurantType',
        'user',
        'menuCategories',
        'menuCategories.menuItems',
        'menuCategories.menuItems.menuItemOptions',
        'menuCategories.menuItems.menuItemOptions.menuItemOptionValues',
      ],
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    // Fetch review stats
    const reviewStats = await this.clientReviewRestaurantRepository
      .createQueryBuilder('review')
      .select('COUNT(review.id)', 'review_count')
      .addSelect('AVG(review.rating)', 'average_rating')
      .where('review.restaurantId = :id', { id })
      .getRawOne();

    restaurant.review_count = reviewStats ? parseInt(reviewStats.review_count) : 0;
    restaurant.average_rating = reviewStats
      ? parseFloat(parseFloat(reviewStats.average_rating).toFixed(2))
      : 0;

    return restaurant;
  }

  async update(id: number, updateDto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    if (updateDto.siret && updateDto.siret !== restaurant.siret) {
      const existing = await this.restaurant_repository.findOne({
        where: { siret: updateDto.siret },
      });

      if (existing) {
        throw new ConflictException(
          `Le numéro SIRET ${updateDto.siret} est déjà utilisé`,
        );
      }
    }

    Object.assign(restaurant, updateDto);
    return await this.restaurant_repository.save(restaurant);
  }

  async remove(id: number): Promise<void> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé.`);
    }

    const menuCategories = await this.menuCategoryRepository.find({
      where: { restaurantId: id },
    });

    for (const menuCategory of menuCategories) {
      const menuItems = await this.menuItemRepository.find({
        where: { menuCategoryId: menuCategory.id },
      });

      for (const menuItem of menuItems) {
        const menuItemOptions = await this.menuItemOptionRepository.find({
          where: { menuItemId: menuItem.id },
        });

        for (const menuItemOption of menuItemOptions) {
          await this.menuItemOptionValueRepository.delete({
            menuItemOptionId: menuItemOption.id,
          });
        }

        await this.menuItemOptionRepository.delete({
          menuItemId: menuItem.id },
        );
      }

      await this.menuItemRepository.delete({
        menuCategoryId: menuCategory.id },
      );
    }

    await this.menuCategoryRepository.delete({
      restaurantId: id },
    );

    await this.restaurant_repository.remove(restaurant);
  }

  async getRestaurantFromUser(
    userId: number,
    page = 1,
    limit = 10,
  ): Promise<{ restaurants: Restaurant[]; total: number }> {
    const [restaurants, total] = await this.restaurant_repository.findAndCount({
      where: { userId },
      relations: ['restaurantType'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    // Fetch review stats for all restaurants in one query
    const reviewStats = await this.clientReviewRestaurantRepository
      .createQueryBuilder('review')
      .select('review.restaurantId', 'restaurantId')
      .addSelect('COUNT(review.id)', 'review_count')
      .addSelect('AVG(review.rating)', 'average_rating')
      .where('review.restaurantId IN (:...ids)', {
        ids: restaurants.map((r) => r.id),
      })
      .groupBy('review.restaurantId')
      .getRawMany();

    // Map review stats to restaurants
    const restaurantsWithStats = restaurants.map((restaurant) => {
      const stats = reviewStats.find(
        (s) => s.restaurantId === restaurant.id,
      );
      restaurant.review_count = stats ? parseInt(stats.review_count) : 0;
      restaurant.average_rating = stats
        ? parseFloat(parseFloat(stats.average_rating).toFixed(2))
        : 0;
      return restaurant;
    });

    return { restaurants: restaurantsWithStats, total };
  }
}