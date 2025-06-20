import { Injectable, InternalServerErrorException, Logger, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
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
    @InjectRepository(User)
    private readonly user_repository: Repository<User>,
      @InjectRepository(Images) // Injectez le repository de Image
  private readonly images_repository: Repository<Images>,
  ) {}

  async create(create_restaurant_dto: CreateRestaurantDto) {
    const restaurant = this.restaurant_repository.create(create_restaurant_dto);
    //var apiRequest =`https://api-adresse.data.gouv.fr/search/?q=${create_restaurant_dto.street_number}+${StringUtils.replaceSpacesWithPlus(create_restaurant_dto.street)}&postcode=${create_restaurant_dto.postal_code}`
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

async uploadImage(restaurantId: number, file: Express.Multer.File): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id: restaurantId },
      relations: ['images'], // Charger les images existantes pour ce restaurant
    });

    if (!restaurant) {
      // Supprimer le fichier uploadé si le restaurant n'existe pas
      await fs.unlink(file.path).catch(e => this.logger.error(`Erreur lors de la suppression du fichier temporaire: ${file.path}`, e.stack));
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found.`);
    }

    let newFileName: string;
    let processedFilePathFull: string;

    try {
      // --- PARTIE 1: Gérer l'ancienne image (si elle existe) ---
      const existingImage = restaurant.images.find(img => img.isMain); // Ou la première image trouvée, si vous n'avez pas de `isMain`

      if (existingImage) {
        this.logger.log(`Image existante trouvée pour le restaurant ${restaurantId}. ID: ${existingImage.id}, Chemin: ${existingImage.path}`);
        const oldFilePath = join('./uploads', existingImage.path); // Reconstruire le chemin complet
        
        try {
          // Supprimer le fichier physique de l'ancienne image
          await fs.unlink(oldFilePath);
          this.logger.log(`Ancienne image supprimée du système de fichiers: ${oldFilePath}`);
        } catch (unlinkError) {
          // Loguer l'erreur mais ne pas bloquer si le fichier n'existe pas ou ne peut pas être supprimé (ex: déjà supprimé)
          this.logger.warn(`Impossible de supprimer l'ancienne image du système de fichiers: ${oldFilePath}. Erreur: ${unlinkError.message}`);
        }

        // Supprimer l'enregistrement de l'ancienne image de la base de données
        await this.images_repository.remove(existingImage);
        this.logger.log(`Ancienne image supprimée de la base de données. ID: ${existingImage.id}`);
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
      await fs.unlink(file.path).catch(e => this.logger.error(`Erreur lors de la suppression du fichier original temporaire: ${file.path}`, e.stack));

      // Créer et sauvegarder le nouvel enregistrement d'image
      const newImage = this.images_repository.create({
        filename: newFileName, // Nom du fichier traité
        path: relativePathForDb, // Chemin relatif ou URL pour la base de données
        mimetype: 'image/webp', // Mime type après conversion
        size: (await fs.stat(processedFilePathFull)).size, // Taille du fichier traité
        restaurant: restaurant,          // Link the Restaurant object
        restaurant_id: restaurant.id,    // Explicitly set the ID
        menu_item: null,                 // Explicitly set menu_item to null
        menu_item_id: null,              // Explicitly set menu_item_id to null
        entityType: 'restaurant',        // Set the type
        isMain: true,
      });

      await this.images_repository.save(newImage);
      this.logger.log(`Nouvelle image enregistrée pour le restaurant ${restaurantId}. Nom: ${newFileName}`);
      // --- FIN PARTIE 2 ---

      // Recharger le restaurant pour inclure la nouvelle image et ses relations mises à jour
      // Utilisez un rechargement complet pour s'assurer que les relations sont à jour
      return await this.restaurant_repository.findOne({
        where: { id: restaurantId },
        relations: ['images'],
      });

    } catch (error) {
      this.logger.error(`Erreur lors du traitement ou de l'enregistrement de l'image pour le restaurant ${restaurantId}: ${error.message}`, error.stack);
      // Supprimer le fichier processed si une erreur survient APRÈS le traitement mais AVANT la sauvegarde DB
      if (file && file.path) {
        // Supprimer le fichier temporaire de multer
        await fs.unlink(file.path).catch(e => this.logger.error(`Erreur lors de la suppression du fichier temporaire en cas d'erreur globale: ${file.path}`, e.stack));
      }
      // Si le fichier traité a été créé avant l'erreur, tentez de le supprimer aussi
      if (processedFilePathFull && (await fs.stat(processedFilePathFull).catch(() => null))) { // Vérifier si le fichier existe
         await fs.unlink(processedFilePathFull).catch(e => this.logger.error(`Erreur lors de la suppression du fichier traité en cas d'erreur globale: ${processedFilePathFull}`, e.stack));
      }

      throw new InternalServerErrorException('Échec du traitement et de l\'enregistrement de l\'image.');
    }
  }

   async removeImage(restaurantId: number, imageId: number): Promise<Restaurant> {
    const restaurant = await this.restaurant_repository.findOne({
      where: { id: restaurantId },
      relations: ['images'], // Assurez-vous que les images sont chargées
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${restaurantId} not found.`);
    }

    // Trouver l'image à supprimer, en s'assurant qu'elle est bien liée à ce restaurant
    const imageToRemove = restaurant.images.find(img => img.id === imageId && img.restaurant_id === restaurantId);
    if (!imageToRemove) {
      throw new NotFoundException(`Image with ID ${imageId} not found for Restaurant ${restaurantId} or not associated.`);
    }

    try {
      const imageFullPath = join('./uploads', imageToRemove.path);

      // Tenter de supprimer le fichier physique
      try {
        await fs.unlink(imageFullPath);
        this.logger.log(`Image supprimée du système de fichiers: ${imageFullPath}`);
      } catch (unlinkError) {
        this.logger.warn(`Impossible de supprimer l'image du système de fichiers: ${imageFullPath}. Erreur: ${unlinkError.message}`);
      }
      
      // Supprimer l'enregistrement de l'image de la base de données
      await this.images_repository.remove(imageToRemove);
      this.logger.log(`Image supprimée de la base de données. ID: ${imageToRemove.id}`);

      // Gérer la nouvelle image principale si l'image supprimée était la principale
      const remainingImages = restaurant.images.filter(img => img.id !== imageId);
      if (imageToRemove.isMain && remainingImages.length > 0) {
        // Trouver la prochaine image principale parmi celles liées au même Restaurant
        const nextMainImage = remainingImages.find(img => img.restaurant_id === restaurantId);
        if (nextMainImage) {
          nextMainImage.isMain = true;
          await this.images_repository.save(nextMainImage);
          this.logger.log(`Nouvelle image principale définie pour le Restaurant ${restaurantId}. ID: ${nextMainImage.id}`);
        }
      }

      // Recharger le restaurant pour retourner l'état mis à jour
      return await this.restaurant_repository.findOne({
        where: { id: restaurantId },
        relations: ['images'],
      });

    } catch (error) {
      this.logger.error(`Erreur lors de la suppression de l'image pour le Restaurant ${restaurantId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Échec de la suppression de l\'image.');
    }
  }
}
