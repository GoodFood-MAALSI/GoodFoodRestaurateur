import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { MenuItem } from './entities/menu_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { Images } from '../images/entities/images.entity';
import * as sharp from 'sharp'; // Pour le traitement d'image
import * as fs from 'fs/promises'; // Pour les opérations de fichiers asynchrones
import { join } from 'path';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class MenuItemsService {
  private readonly logger = new Logger(MenuItemsService.name);

  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
    @InjectRepository(Images)
    private readonly images_repository: Repository<Images>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  private async checkRestaurantAccess(
    menuCategoryId: number,
    userId: number,
  ): Promise<void> {
    const menuCategory = await this.menuCategoryRepository.findOne({
      where: { id: menuCategoryId },
      relations: ['restaurant'],
    });

    if (!menuCategory) {
      throw new NotFoundException(
        `Catégorie de menu avec l'ID ${menuCategoryId} non trouvée.`,
      );
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: menuCategory.restaurantId, userId },
    });

    if (!restaurant) {
      throw new ForbiddenException("Vous n'avez pas accès à ce restaurant.");
    }
  }

  async create(
    createMenuItemDto: CreateMenuItemDto,
    userId: number,
  ): Promise<MenuItem> {
    await this.checkRestaurantAccess(createMenuItemDto.menuCategoryId, userId);

    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    return await this.menuItemRepository.save(menuItem);
  }

  async update(
    id: number,
    dto: UpdateMenuItemDto,
    userId: number,
  ): Promise<MenuItem> {
    const existing = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['menuCategory'],
    });
    if (!existing) {
      throw new NotFoundException(`Menu item avec l'ID ${id} non trouvé.`);
    }

    await this.checkRestaurantAccess(existing.menuCategoryId, userId);

    if (dto.position !== undefined && dto.position !== existing.position) {
      const conflict = await this.menuItemRepository.findOne({
        where: {
          menuCategoryId: existing.menuCategoryId,
          position: dto.position,
        },
      });

      if (conflict && conflict.id !== id) {
        throw new BadRequestException(
          `La position ${dto.position} est déjà utilisée pour cette catégorie.`,
        );
      }
    }

    const updated = await this.menuItemRepository.preload({
      id,
      ...dto,
    });

    if (!updated) {
      throw new NotFoundException(
        `Menu item avec l'ID ${id} introuvable après preload.`,
      );
    }

    return this.menuItemRepository.save(updated);
  }

  async remove(id: number, userId: number): Promise<void> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['menuCategory'],
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item avec l'ID ${id} non trouvé.`);
    }

    await this.checkRestaurantAccess(menuItem.menuCategoryId, userId);

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

    await this.menuItemRepository.remove(menuItem);
  }

  async uploadImage(
    menuItemId: number,
    file: Express.Multer.File,
    userId: number,
  ): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: menuItemId },
      relations: ['images', 'menuCategory'],
    });

    if (!menuItem) {
      await fs
        .unlink(file.path)
        .catch((e) =>
          this.logger.error(
            `Erreur lors de la suppression du fichier temporaire: ${file.path}`,
            e.stack,
          ),
        );
      throw new NotFoundException(
        `MenuItem avec l'ID ${menuItemId} non trouvé.`,
      );
    }

    await this.checkRestaurantAccess(menuItem.menuCategoryId, userId);

    let newFileName: string;
    let processedFilePathFull: string;

    try {
      const existingMainImage = menuItem.images?.find((img) => img.isMain);

      if (existingMainImage) {
        this.logger.log(
          `Image existante trouvée pour le menuItem ${menuItemId}. ID: ${existingMainImage.id}, Chemin: ${existingMainImage.path}`,
        );
        const oldFilePath = join('./', existingMainImage.path);

        try {
          await fs.unlink(oldFilePath);
          this.logger.log(
            `Ancienne image supprimée du système de fichiers: ${oldFilePath}`,
          );
        } catch (unlinkError) {
          this.logger.warn(
            `Impossible de supprimer l'ancienne image du système de fichiers: ${oldFilePath}. Erreur: ${unlinkError['message']}`,
          );
        }

        await this.images_repository.remove(existingMainImage);
        this.logger.log(
          `Ancienne image supprimée de la base de données. ID: ${existingMainImage.id}`,
        );
      }

      const filenameWithoutExt = file.filename.split('.')[0];
      newFileName = `${filenameWithoutExt}-${Date.now()}.webp`;
      processedFilePathFull = join(file.destination, newFileName);
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
        menu_item: menuItem,
        menu_item_id: menuItem.id,
        restaurant: null,
        restaurant_id: null,
        entityType: 'menu_item',
        isMain: true,
      });

      await this.images_repository.save(newImage);
      this.logger.log(
        `Nouvelle image enregistrée pour le MenuItem ${menuItemId}. Nom: ${newFileName}`,
      );

      return await this.menuItemRepository.findOne({
        where: { id: menuItemId },
        relations: ['images'],
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors du traitement ou de l'enregistrement de l'image pour le MenuItem ${menuItemId}: ${error.message}`,
        error.stack,
      );

      if (file && file.path) {
        const fileExists = await fs
          .access(file.path)
          .then(() => true)
          .catch(() => false);
        if (fileExists) {
          await fs
            .unlink(file.path)
            .catch((e) =>
              this.logger.error(
                `Erreur lors de la suppression du fichier temporaire en cas d'erreur globale: ${file.path}`,
                e.stack,
              ),
            );
        } else {
          this.logger.warn(
            `Cleanup: Fichier original temporaire ${file.path} non trouvé.`,
          );
        }
      }
      if (processedFilePathFull) {
        const processedFileExists = await fs
          .access(processedFilePathFull)
          .then(() => true)
          .catch(() => false);
        if (processedFileExists) {
          await fs
            .unlink(processedFilePathFull)
            .catch((e) =>
              this.logger.error(
                `Erreur lors de la suppression du fichier traité en cas d'erreur globale: ${processedFilePathFull}`,
                e.stack,
              ),
            );
        } else {
          this.logger.warn(
            `Cleanup: Fichier traité ${processedFilePathFull} non trouvé.`,
          );
        }
      }

      throw new InternalServerErrorException(
        "Échec du traitement et de l'enregistrement de l'image.",
      );
    }
  }

  async removeImage(
    menuItemId: number,
    imageId: number,
    userId: number,
  ): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: menuItemId },
      relations: ['images', 'menuCategory'],
    });

    if (!menuItem) {
      throw new NotFoundException(
        `MenuItem avec l'ID ${menuItemId} non trouvé.`,
      );
    }

    await this.checkRestaurantAccess(menuItem.menuCategoryId, userId);

    const imageToRemove = menuItem.images.find(
      (img) => img.id === imageId && img.menu_item_id === menuItemId,
    );
    if (!imageToRemove) {
      throw new NotFoundException(
        `Image avec l'ID ${imageId} non trouvée pour le MenuItem ${menuItemId} ou non associée.`,
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

      const remainingImages = menuItem.images.filter(
        (img) => img.id !== imageId,
      );
      if (imageToRemove.isMain && remainingImages.length > 0) {
        const nextMainImage = remainingImages.find(
          (img) => img.menu_item_id === menuItemId,
        );
        if (nextMainImage) {
          nextMainImage.isMain = true;
          await this.images_repository.save(nextMainImage);
          this.logger.log(
            `Nouvelle image principale définie pour le MenuItem ${menuItemId}. ID: ${nextMainImage.id}`,
          );
        }
      }

      return await this.menuItemRepository.findOne({
        where: { id: menuItemId },
        relations: ['images'],
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression de l'image pour le MenuItem ${menuItemId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Échec de la suppression de l'image.",
      );
    }
  }

  async findOne(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
    });
    if (!menuItem) {
      throw new NotFoundException('Menu item non trouvé');
    }
    return menuItem;
  }
}
