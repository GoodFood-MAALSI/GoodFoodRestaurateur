import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientReviewRestaurant } from './entities/client-review-restaurant.entity';
import { CreateClientReviewRestaurantDto } from './dto/create-client-review-restaurant.dto';

@Injectable()
export class ClientReviewRestaurantService {
  constructor(
    @InjectRepository(ClientReviewRestaurant)
    private readonly clientReviewRestaurantRepository: Repository<ClientReviewRestaurant>,
  ) {}

  async create(
    createClientReviewRestaurantDto: CreateClientReviewRestaurantDto,
  ): Promise<ClientReviewRestaurant> {
    const clientReview = this.clientReviewRestaurantRepository.create({
      ...createClientReviewRestaurantDto,
    });
    return await this.clientReviewRestaurantRepository.save(clientReview);
  }

  async findOne(id: number): Promise<ClientReviewRestaurant> {
    const clientReview = await this.clientReviewRestaurantRepository.findOne({
      where: { id },
    });
    if (!clientReview) {
      throw new NotFoundException('Review not found');
    }
    return clientReview;
  }

  async remove(id: number): Promise<void> {
    const clientReview = await this.findOne(id);
    await this.clientReviewRestaurantRepository.remove(clientReview);
  }

  async findByUser(clientId: number): Promise<ClientReviewRestaurant[]> {
    return await this.clientReviewRestaurantRepository.find({
      where: { clientId },
      relations: ['restaurant'],
    });
  }
}
