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
import { StringUtils } from './string-utils.service';
import * as sharp from 'sharp'; // Pour le traitement d'image
import * as fs from 'fs/promises'; // Pour les opérations de fichiers asynchrones
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
    try {
      const queryBuilder = this.restaurant_repository
        .createQueryBuilder('restaurant')
        .leftJoinAndSelect('restaurant.restaurantType', 'restaurantType');

      if (filters.name) {
        queryBuilder.andWhere(
          '(restaurant.name ILIKE :name OR restaurant.description ILIKE :name)',
          { name: `%${filters.name}%` },
        );
      }

      if (filters.is_open !== undefined) {
        queryBuilder.andWhere('restaurant.is_open = :is_open', {
          is_open: filters.is_open,
        });
      }

      if (filters.city) {
        queryBuilder.andWhere('restaurant.city ILIKE :city', {
          city: `%${filters.city}%`,
        });
      }

      if (filters.restaurant_type) {
        queryBuilder.andWhere(
          'restaurant.restaurantTypeId = :restaurant_type',
          {
            restaurant_type: filters.restaurant_type,
          },
        );
      }

      const allRestaurants = await queryBuilder.getMany();

      // If no restaurants are found, return an empty result
      if (!allRestaurants.length) {
        return { restaurants: [], total: 0 };
      }

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
      const stats = reviewStats.find((s) => s.restaurantId === restaurant.id);
      restaurant.review_count = stats ? parseInt(stats.review_count) : 0;
      restaurant.average_rating = stats
        ? parseFloat(parseFloat(stats.average_rating).toFixed(2))
        : 0;
      return restaurant;
    });

    return { restaurants: restaurantsWithStats, total };
  }
  async uploadImage(
    restaurantId: number,
    file: Express.Multer.File,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id: restaurantId },
      relations: ['images'], // Charger les images existantes pour ce restaurant
    });

    if (!restaurant) {
      // Supprimer le fichier uploadé si le restaurant n'existe pas
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

    let newFileName: string;
    let processedFilePathFull: string;

    try {
      // --- PARTIE 1: Gérer l'ancienne image (si elle existe) ---
      const existingImage = restaurant.images.find((img) => img.isMain); // Ou la première image trouvée, si vous n'avez pas de `isMain`

      if (existingImage) {
        this.logger.log(
          `Image existante trouvée pour le restaurant ${restaurantId}. ID: ${existingImage.id}, Chemin: ${existingImage.path}`,
        );
        const oldFilePath = join('./uploads', existingImage.path); // Reconstruire le chemin complet

        try {
          // Supprimer le fichier physique de l'ancienne image
          await fs.unlink(oldFilePath);
          this.logger.log(
            `Ancienne image supprimée du système de fichiers: ${oldFilePath}`,
          );
        } catch (unlinkError) {
          // Loguer l'erreur mais ne pas bloquer si le fichier n'existe pas ou ne peut pas être supprimé (ex: déjà supprimé)
          this.logger.warn(
            `Impossible de supprimer l'ancienne image du système de fichiers: ${oldFilePath}. Erreur: ${unlinkError.message}`,
          );
        }

        // Supprimer l'enregistrement de l'ancienne image de la base de données
        await this.images_repository.remove(existingImage);
        this.logger.log(
          `Ancienne image supprimée de la base de données. ID: ${existingImage.id}`,
        );
      }
      // --- FIN PARTIE 1 ---

      // --- PARTIE 2: Traitement et enregistrement de la nouvelle image ---
      const filenameWithoutExt = file.filename.split('.')[0];
      const newFileName = `${filenameWithoutExt}-${Date.now()}.webp`; // Nom unique pour le fichier traité (WebP)
      const processedFilePathFull = join(file.destination, newFileName); // Chemin complet du fichier traité sur le serveur
      const relativePathForDb = join('images', newFileName); // Chemin relatif pour la DB (après 'uploads')

      // Traitement d'image avec Sharp
      await sharp(file.path)
        .resize(800) // Redimensionner à une largeur de 800px (hauteur auto)
        .webp({ quality: 80 }) // Compresser en WebP avec une qualité de 80
        .toFile(processedFilePathFull);

      // Supprimer le fichier original non traité (temporaire de Multer)
      await fs
        .unlink(file.path)
        .catch((e) =>
          this.logger.error(
            `Erreur lors de la suppression du fichier original temporaire: ${file.path}`,
            e.stack,
          ),
        );

      // Créer et sauvegarder le nouvel enregistrement d'image
      const newImage = this.images_repository.create({
        filename: newFileName, // Nom du fichier traité
        path: relativePathForDb, // Chemin relatif ou URL pour la base de données
        mimetype: 'image/webp', // Mime type après conversion
        size: (await fs.stat(processedFilePathFull)).size, // Taille du fichier traité
        restaurant: restaurant, // Link the Restaurant object
        restaurant_id: restaurant.id, // Explicitly set the ID
        menu_item: null, // Explicitly set menu_item to null
        menu_item_id: null, // Explicitly set menu_item_id to null
        entityType: 'restaurant', // Set the type
        isMain: true,
      });

      await this.images_repository.save(newImage);
      this.logger.log(
        `Nouvelle image enregistrée pour le restaurant ${restaurantId}. Nom: ${newFileName}`,
      );
      // --- FIN PARTIE 2 ---

      // Recharger le restaurant pour inclure la nouvelle image et ses relations mises à jour
      // Utilisez un rechargement complet pour s'assurer que les relations sont à jour
      return await this.restaurant_repository.findOne({
        where: { id: restaurantId },
        relations: ['images'],
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors du traitement ou de l'enregistrement de l'image pour le restaurant ${restaurantId}: ${error.message}`,
        error.stack,
      );
      // Supprimer le fichier processed si une erreur survient APRÈS le traitement mais AVANT la sauvegarde DB
      if (file && file.path) {
        // Supprimer le fichier temporaire de multer
        await fs
          .unlink(file.path)
          .catch((e) =>
            this.logger.error(
              `Erreur lors de la suppression du fichier temporaire en cas d'erreur globale: ${file.path}`,
              e.stack,
            ),
          );
      }
      // Si le fichier traité a été créé avant l'erreur, tentez de le supprimer aussi
      if (
        processedFilePathFull &&
        (await fs.stat(processedFilePathFull).catch(() => null))
      ) {
        // Vérifier si le fichier existe
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
      relations: ['images'], // Assurez-vous que les images sont chargées
    });

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found.`,
      );
    }

    // Trouver l'image à supprimer, en s'assurant qu'elle est bien liée à ce restaurant
    const imageToRemove = restaurant.images.find(
      (img) => img.id === imageId && img.restaurant_id === restaurantId,
    );
    if (!imageToRemove) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found for Restaurant ${restaurantId} or not associated.`,
      );
    }

    try {
      const imageFullPath = join('./uploads', imageToRemove.path);

      // Tenter de supprimer le fichier physique
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

      // Supprimer l'enregistrement de l'image de la base de données
      await this.images_repository.remove(imageToRemove);
      this.logger.log(
        `Image supprimée de la base de données. ID: ${imageToRemove.id}`,
      );

      // Gérer la nouvelle image principale si l'image supprimée était la principale
      const remainingImages = restaurant.images.filter(
        (img) => img.id !== imageId,
      );
      if (imageToRemove.isMain && remainingImages.length > 0) {
        // Trouver la prochaine image principale parmi celles liées au même Restaurant
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

      // Recharger le restaurant pour retourner l'état mis à jour
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
