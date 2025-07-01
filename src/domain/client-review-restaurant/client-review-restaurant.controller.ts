import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ClientReviewRestaurantService } from './client-review-restaurant.service';
import { CreateClientReviewRestaurantDto } from './dto/create-client-review-restaurant.dto';

@Controller('client-review-restaurant')
export class ClientReviewRestaurantController {
  constructor(
    private readonly ClientReviewRestaurantService: ClientReviewRestaurantService,
  ) {}

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: "Récupérer les avis d'un restaurant spécifique" })
  @ApiParam({
    name: 'restaurantId',
    description: 'ID du restaurant',
    type: Number,
  })
  async getReviewsFromRestaurant(@Param('restaurantId') restaurantId: string) {
    const id = parseInt(restaurantId);
    if (isNaN(id)) {
      throw new HttpException('restaurantId invalide', HttpStatus.BAD_REQUEST);
    }

    return await this.ClientReviewRestaurantService.findByRestaurant(id);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: "Récupérer les avis d'un client spécifique" })
  @ApiParam({ name: 'clientId', description: 'ID du client', type: Number })
  async getMyReviews(@Param('clientId') clientId: string) {
    const id = parseInt(clientId);
    if (isNaN(id)) {
      throw new HttpException('clientId invalide', HttpStatus.BAD_REQUEST);
    }

    return await this.ClientReviewRestaurantService.findByUser(id);
  }

  @Post()
  @ApiOperation({ summary: 'Ajouter un avis' })
  @ApiBody({ type: CreateClientReviewRestaurantDto })
  async create(
    @Body() createClientReviewRestaurantDto: CreateClientReviewRestaurantDto,
  ) {
    try {
      const createdReview = await this.ClientReviewRestaurantService.create(
        createClientReviewRestaurantDto,
      );
      return createdReview;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create review',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un avis' })
  async remove(@Param('id') id: string) {
    return this.ClientReviewRestaurantService.remove(+id);
  }
}
