import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant, RestaurantStatus } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import * as geolib from 'geolib';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { ClientReviewRestaurant } from '../client-review-restaurant/entities/client-review-restaurant.entity';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import { Images } from '../images/entities/images.entity';
import { join } from 'path';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

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
    @InjectRepository(Images)
    private readonly images_repository: Repository<Images>,
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

    where.status = filters.status ?? RestaurantStatus.Active;

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
        relations: ['restaurantType', 'images'],
      });

      let reviewStats: any[] = [];
      if (allRestaurants.length > 0) {
        reviewStats = await this.clientReviewRestaurantRepository
          .createQueryBuilder('review')
          .select('review.restaurantId', 'restaurantId')
          .addSelect('COUNT(review.id)', 'review_count')
          .addSelect('AVG(review.rating)', 'average_rating')
          .where('review.restaurantId IN (:...ids)', {
            ids: allRestaurants.map((r) => r.id),
          })
          .groupBy('review.restaurantId')
          .getRawMany();
      }

      // Map review stats to restaurants
      const restaurantsWithStats = allRestaurants.map((restaurant) => {
        const stats = reviewStats.find((s) => s.restaurantId === restaurant.id);
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
        'images',
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

    const reviewStats = await this.clientReviewRestaurantRepository
      .createQueryBuilder('review')
      .select('COUNT(review.id)', 'review_count')
      .addSelect('AVG(review.rating)', 'average_rating')
      .where('review.restaurantId = :id', { id })
      .getRawOne();

    restaurant.review_count = reviewStats
      ? parseInt(reviewStats.review_count)
      : 0;
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

    if (restaurant.status === RestaurantStatus.Suspended) {
      throw new HttpException(
        'Impossible de modifier un restaurant suspendu',
        HttpStatus.BAD_REQUEST,
      );
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
      relations: ['restaurantType', 'images'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    let reviewStats: any[] = [];
    if (restaurants.length > 0) {
      reviewStats = await this.clientReviewRestaurantRepository
        .createQueryBuilder('review')
        .select('review.restaurantId', 'restaurantId')
        .addSelect('COUNT(review.id)', 'review_count')
        .addSelect('AVG(review.rating)', 'average_rating')
        .where('review.restaurantId IN (:...ids)', {
          ids: restaurants.map((r) => r.id),
        })
        .groupBy('review.restaurantId')
        .getRawMany();
    }

    const restaurantsWithStats = restaurants.map((restaurant) => {
      const stats = reviewStats.find((s) => s.restaurantId === restaurant.id);
      restaurant.review_count = stats ? parseInt(stats.review_count) : 0;
      restaurant.average_rating = stats
        ? parseFloat(parseFloat(stats.average_rating).toFixed(2))
        : 0;
      return restaurant;
    });

    return { restaurants: restaurantsWithStats, total };
  }

  async suspendRestaurant(id: number): Promise<void> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    if (restaurant.status === RestaurantStatus.Suspended) {
      throw new HttpException(
        'Le restaurant est déjà suspendu',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.restaurant_repository.update(id, {
      status: RestaurantStatus.Suspended,
    });
  }

  async restoreRestaurant(id: number): Promise<void> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    if (restaurant.status !== RestaurantStatus.Suspended) {
      throw new HttpException(
        "Le restaurant n'est pas suspendu",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.restaurant_repository.update(id, {
      status: RestaurantStatus.Active,
    });
  }

  async uploadImage(
    restaurantId: number,
    file: Express.Multer.File,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id: restaurantId },
      relations: ['images'],
    });

    if (!restaurant) {
      await fs
        .unlink(file.path)
        .catch((e) =>
          this.logger.error(
            `Erreur lors de la suppression du fichier temporaire: ${file.path}`,
            e.stack,
          ),
        );
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found.`,
      );
    }

    if (restaurant.status === RestaurantStatus.Suspended) {
      await fs
        .unlink(file.path)
        .catch((e) =>
          this.logger.error(
            `Erreur lors de la suppression du fichier temporaire: ${file.path}`,
            e.stack,
          ),
        );
      throw new HttpException(
        'Impossible d’uploader une image pour un restaurant suspendu',
        HttpStatus.BAD_REQUEST,
      );
    }

    let newFileName: string;
    let processedFilePathFull: string;

    try {
      const existingImage = restaurant.images.find((img) => img.isMain);

      if (existingImage) {
        this.logger.log(
          `Image existante trouvée pour le restaurant ${restaurantId}. ID: ${existingImage.id}, Chemin: ${existingImage.path}`,
        );
        const oldFilePath = join('./', existingImage.path);

        try {
          await fs.unlink(oldFilePath);
          this.logger.log(
            `Ancienne image supprimée du système de fichiers: ${oldFilePath}`,
          );
        } catch (unlinkError) {
          this.logger.warn(
            `Impossible de supprimer l'ancienne image du système de fichiers: ${oldFilePath}. Erreur: ${unlinkError.message}`,
          );
        }

        await this.images_repository.remove(existingImage);
        this.logger.log(
          `Ancienne image supprimée de la base de données. ID: ${existingImage.id}`,
        );
      }

      const filenameWithoutExt = file.filename.split('.')[0];
      const newFileName = `${filenameWithoutExt}-${Date.now()}.webp`;
      const processedFilePathFull = join(file.destination, newFileName);
      const relativePathForDb = join('uploads', newFileName);

      await sharp(file.path)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(processedFilePathFull);

      await fs
        .unlink(file.path)
        .catch((e) =>
          this.logger.error(
            `Erreur lors de la suppression du fichier original temporaire: ${file.path}`,
            e.stack,
          ),
        );

      const newImage = this.images_repository.create({
        filename: newFileName,
        path: relativePathForDb,
        mimetype: 'image/webp',
        size: (await fs.stat(processedFilePathFull)).size,
        restaurant: restaurant,
        restaurant_id: restaurant.id,
        menu_item: null,
        menu_item_id: null,
        entityType: 'restaurant',
        isMain: true,
      });

      await this.images_repository.save(newImage);
      this.logger.log(
        `Nouvelle image enregistrée pour le restaurant ${restaurantId}. Nom: ${newFileName}`,
      );
      return await this.restaurant_repository.findOne({
        where: { id: restaurantId },
        relations: ['images'],
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors du traitement ou de l'enregistrement de l'image pour le restaurant ${restaurantId}: ${error.message}`,
        error.stack,
      );
      if (file && file.path) {
        await fs
          .unlink(file.path)
          .catch((e) =>
            this.logger.error(
              `Erreur lors de la suppression du fichier temporaire en cas d'erreur globale: ${file.path}`,
              e.stack,
            ),
          );
      }
      if (
        processedFilePathFull &&
        (await fs.stat(processedFilePathFull).catch(() => null))
      ) {
        await fs
          .unlink(processedFilePathFull)
          .catch((e) =>
            this.logger.error(
              `Erreur lors de la suppression du fichier traité en cas d'erreur globale: ${processedFilePathFull}`,
              e.stack,
            ),
          );
      }

      throw new InternalServerErrorException(
        "Échec du traitement et de l'enregistrement de l'image.",
      );
    }
  }

  async removeImage(
    restaurantId: number,
    imageId: number,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id: restaurantId },
      relations: ['images'],
    });

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found.`,
      );
    }

    if (restaurant.status === RestaurantStatus.Suspended) {
      throw new HttpException(
        'Impossible de supprimer une image d’un restaurant suspendu',
        HttpStatus.BAD_REQUEST,
      );
    }

    const imageToRemove = restaurant.images.find(
      (img) => img.id === imageId && img.restaurant_id === restaurantId,
    );
    if (!imageToRemove) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found for Restaurant ${restaurantId} or not associated.`,
      );
    }

    try {
      const imageFullPath = join('./', imageToRemove.path);

      try {
        await fs.unlink(imageFullPath);
        this.logger.log(
          `Image supprimée du système de fichiers: ${imageFullPath}`,
        );
      } catch (unlinkError) {
        this.logger.warn(
          `Impossible de supprimer l'image du système de fichiers: ${imageFullPath}. Erreur: ${unlinkError.message}`,
        );
      }

      await this.images_repository.remove(imageToRemove);
      this.logger.log(
        `Image supprimée de la base de données. ID: ${imageToRemove.id}`,
      );

      const remainingImages = restaurant.images.filter(
        (img) => img.id !== imageId,
      );
      if (imageToRemove.isMain && remainingImages.length > 0) {
        const nextMainImage = remainingImages.find(
          (img) => img.restaurant_id === restaurantId,
        );
        if (nextMainImage) {
          nextMainImage.isMain = true;
          await this.images_repository.save(nextMainImage);
          this.logger.log(
            `Nouvelle image principale définie pour le Restaurant ${restaurantId}. ID: ${nextMainImage.id}`,
          );
        }
      }

      return await this.restaurant_repository.findOne({
        where: { id: restaurantId },
        relations: ['images'],
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression de l'image pour le Restaurant ${restaurantId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Échec de la suppression de l'image.",
      );
    }
  }
}
