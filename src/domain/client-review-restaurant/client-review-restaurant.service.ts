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
import { InterserviceService } from '../interservice/interservice.service';
import { Client } from '../interservice/interfaces/client.interface';
import { Pagination } from '../utils/pagination';

@Injectable()
export class ClientReviewRestaurantService {
  constructor(
    @InjectRepository(ClientReviewRestaurant)
    private readonly clientReviewRestaurantRepository: Repository<ClientReviewRestaurant>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly interserviceService: InterserviceService,
  ) {}

  private async enrichReview(review: ClientReviewRestaurant): Promise<ClientReviewRestaurant & { client?: Client }> {
    const client = await this.interserviceService.fetchClient(review.clientId);
    return { ...review, client };
  }

  private async enrichReviews(reviews: ClientReviewRestaurant[]): Promise<(ClientReviewRestaurant & { client?: Client })[]> {
    return Promise.all(reviews.map((review) => this.enrichReview(review)));
  }

  async create(
    createClientReviewRestaurantDto: CreateClientReviewRestaurantDto,
  ): Promise<ClientReviewRestaurant & { client?: Client }> {
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
    const savedReview = await this.clientReviewRestaurantRepository.save(clientReview);
    return this.enrichReview(savedReview);
  }

  async findAll(
    rating?: number,
    status?: ReviewStatus,
    page = 1,
    limit = 10,
    req?: any,
  ): Promise<{
    reviews: (ClientReviewRestaurant & { client?: Client })[];
    total: number;
    links?: any;
    meta?: any;
  }> {
    const where: any = {};
    if (rating) {
      where.rating = rating;
    }
    if (status) {
      where.status = status;
    }

    const [reviews, total] = await this.clientReviewRestaurantRepository.findAndCount({
      where,
      relations: ['restaurant'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const enrichedReviews = await this.enrichReviews(reviews);

    let links: any = {};
    let meta: any = {};
    if (req) {
      const pagination = Pagination.generatePaginationMetadata(req, page, total, limit);
      links = pagination.links;
      meta = pagination.meta;
    }

    return { reviews: enrichedReviews, total, links, meta };
  }

  async findOne(id: number): Promise<ClientReviewRestaurant & { client?: Client }> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
    });
    if (!clientReview) {
      throw new NotFoundException('Review not found');
    }
    return this.enrichReview(clientReview);
  }

  async suspend(id: number): Promise<ClientReviewRestaurant & { client?: Client }> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
    });

    if (!clientReview) {
      throw new NotFoundException('Review not found');
    }

    if (clientReview.status === ReviewStatus.SUSPENDED) {
      throw new HttpException(
        "L'avis est déjà suspendu",
        HttpStatus.BAD_REQUEST,
      );
    }

    clientReview.status = ReviewStatus.SUSPENDED;
    const updatedReview = await this.clientReviewRestaurantRepository.save(clientReview);
    return this.enrichReview(updatedReview);
  }

  async restore(id: number): Promise<ClientReviewRestaurant & { client?: Client }> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
    });

    if (!clientReview) {
      throw new NotFoundException('Review not found');
    }

    if (clientReview.status === ReviewStatus.ACTIVE) {
      throw new HttpException(
        "L'avis n'est pas suspendu",
        HttpStatus.BAD_REQUEST,
      );
    }

    clientReview.status = ReviewStatus.ACTIVE;
    const updatedReview = await this.clientReviewRestaurantRepository.save(clientReview);
    return this.enrichReview(updatedReview);
  }

  async remove(id: number): Promise<void> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
    });

    if (!clientReview) {
      throw new NotFoundException('Review not found');
    }

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
  ): Promise<{
    reviews: (ClientReviewRestaurant & { client?: Client })[];
    total: number;
  }> {
    const [reviews, total] = await this.clientReviewRestaurantRepository.findAndCount({
      where: {
        clientId,
        status: ReviewStatus.ACTIVE,
      },
      relations: ['restaurant'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const enrichedReviews = await this.enrichReviews(reviews);
    return { reviews: enrichedReviews, total };
  }

  async findByRestaurant(
    restaurantId: number,
    page = 1,
    limit = 10,
  ): Promise<{
    reviews: (ClientReviewRestaurant & { client?: Client })[];
    total: number;
  }> {
    const [reviews, total] = await this.clientReviewRestaurantRepository.findAndCount({
      where: {
        restaurantId,
        status: ReviewStatus.ACTIVE,
      },
      relations: ['restaurant'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const enrichedReviews = await this.enrichReviews(reviews);
    return { reviews: enrichedReviews, total };
  }
}