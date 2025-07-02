import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ClientReviewRestaurant,
  ReviewStatus,
} from './entities/client-review-restaurant.entity';
import { CreateClientReviewRestaurantDto } from './dto/create-client-review-restaurant.dto';
import { Restaurant, RestaurantStatus } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class ClientReviewRestaurantService {
  constructor(
    @InjectRepository(ClientReviewRestaurant)
    private readonly clientReviewRestaurantRepository: Repository<ClientReviewRestaurant>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(
    createClientReviewRestaurantDto: CreateClientReviewRestaurantDto,
  ): Promise<ClientReviewRestaurant> {
    const { restaurantId } = createClientReviewRestaurantDto;

    // Vérifier si le restaurant existe et son statut
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${restaurantId} non trouvé`);
    }
    if (restaurant.status === RestaurantStatus.Suspended) {
      throw new HttpException(
        'Impossible de créer un avis pour un restaurant suspendu',
        HttpStatus.BAD_REQUEST,
      );
    }

    const clientReview = this.clientReviewRestaurantRepository.create({
      ...createClientReviewRestaurantDto,
    });
    return await this.clientReviewRestaurantRepository.save(clientReview);
  }

  async findAll(
    rating?: number,
    status?: ReviewStatus,
    page = 1,
    limit = 10,
  ): Promise<{ reviews: ClientReviewRestaurant[]; total: number }> {
    const where: any = {};
    if (rating) {
      where.rating = rating;
    }
    if (status) {
      where.status = status;
    }

    const [reviews, total] =
      await this.clientReviewRestaurantRepository.findAndCount({
        where,
        relations: ['restaurant'],
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
      });

    return { reviews, total };
  }

  async findOne(id: number): Promise<ClientReviewRestaurant> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    if (!clientReview) {
      throw new NotFoundException('Review not found');
    }
    return clientReview;
  }

  async suspend(id: number): Promise<ClientReviewRestaurant> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
    });

    if (clientReview.status === ReviewStatus.SUSPENDED) {
      throw new HttpException(
        "L'avis est déjà suspendu",
        HttpStatus.BAD_REQUEST,
      );
    }

    clientReview.status = ReviewStatus.SUSPENDED;
    return await this.clientReviewRestaurantRepository.save(clientReview);
  }

  async restore(id: number): Promise<ClientReviewRestaurant> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
    });

    if (clientReview.status === ReviewStatus.ACTIVE) {
      throw new HttpException(
        "L'avis n'est pas suspendu",
        HttpStatus.BAD_REQUEST,
      );
    }

    clientReview.status = ReviewStatus.ACTIVE;
    return await this.clientReviewRestaurantRepository.save(clientReview);
  }

  async remove(id: number): Promise<void> {
    const clientReview = await this.findOne(id);

    if (clientReview.status === ReviewStatus.SUSPENDED) {
      throw new HttpException(
        'Impossible de supprimer un avis suspendu',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.clientReviewRestaurantRepository.remove(clientReview);
  }

  async findByUser(
    clientId: number,
    page = 1,
    limit = 10,
  ): Promise<{ reviews: ClientReviewRestaurant[]; total: number }> {
    const [reviews, total] =
      await this.clientReviewRestaurantRepository.findAndCount({
        where: {
          clientId,
          status: ReviewStatus.ACTIVE,
        },
        relations: ['restaurant'],
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
      });

    return { reviews, total };
  }

  async findByRestaurant(
    restaurantId: number,
    page = 1,
    limit = 10,
  ): Promise<{ reviews: ClientReviewRestaurant[]; total: number }> {
    const [reviews, total] =
      await this.clientReviewRestaurantRepository.findAndCount({
        where: {
          restaurantId,
          status: ReviewStatus.ACTIVE,
        },
        relations: ['restaurant'],
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
      });

    return { reviews, total };
  }
}
