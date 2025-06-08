import {
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

      let filteredRestaurants = allRestaurants;
      if (filters.lat && filters.long && filters.perimeter) {
        const center = { latitude: filters.lat, longitude: filters.long };

        filteredRestaurants = allRestaurants.filter((restaurant) => {
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

    return restaurant;
  }

  async update(id: number, update_restaurant_dto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);

    if (!restaurant) {
      throw new NotFoundException();
    }

    Object.assign(restaurant, update_restaurant_dto);
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
          menuItemId: menuItem.id,
        });
      }

      await this.menuItemRepository.delete({
        menuCategoryId: menuCategory.id,
      });
    }

    await this.menuCategoryRepository.delete({
      restaurantId: id,
    });

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

    return { restaurants, total };
  }
}
