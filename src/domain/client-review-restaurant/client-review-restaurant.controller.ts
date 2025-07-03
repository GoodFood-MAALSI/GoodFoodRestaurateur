import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ClientReviewRestaurantService } from './client-review-restaurant.service';
import { CreateClientReviewRestaurantDto } from './dto/create-client-review-restaurant.dto';
import { Request } from 'express';
import { Pagination } from '../utils/pagination';
import { FilterClientReviewRestaurantDto } from './dto/filter-client-review-restaurant.dto';

@Controller('client-review-restaurant')
export class ClientReviewRestaurantController {
  constructor(
    private readonly ClientReviewRestaurantService: ClientReviewRestaurantService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les avis avec filtres optionnels' })
  async findAll(
    @Query() filters: FilterClientReviewRestaurantDto,
    @Req() req: Request,
  ) {
    try {
      const { rating, status, page = 1, limit = 10 } = filters;
      const { reviews, total } =
        await this.ClientReviewRestaurantService.findAll(
          rating,
          status,
          page,
          limit,
        );

      const { links, meta } = Pagination.generatePaginationMetadata(
        req,
        page,
        total,
        limit,
      );

      return { reviews, links, meta };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Échec de la récupération des avis',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: "Récupérer les avis d'un restaurant spécifique" })
  @ApiParam({
    name: 'restaurantId',
    description: 'ID du restaurant',
    type: Number,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getReviewsFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ) {
    try {
      const id = parseInt(restaurantId);
      if (isNaN(id)) {
        throw new HttpException(
          'restaurantId invalide',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { reviews, total } =
        await this.ClientReviewRestaurantService.findByRestaurant(
          id,
          page,
          limit,
        );

      const { links, meta } = Pagination.generatePaginationMetadata(
        req,
        page,
        total,
        limit,
      );

      return { reviews, links, meta };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Échec de la récupération des avis du restaurant',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: "Récupérer les avis d'un client spécifique" })
  @ApiParam({ name: 'clientId', description: 'ID du client', type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getMyReviews(
    @Param('clientId') clientId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ) {
    try {
      const id = parseInt(clientId);
      if (isNaN(id)) {
        throw new HttpException('clientId invalide', HttpStatus.BAD_REQUEST);
      }

      const { reviews, total } =
        await this.ClientReviewRestaurantService.findByUser(id, page, limit);

      const { links, meta } = Pagination.generatePaginationMetadata(
        req,
        page,
        total,
        limit,
      );

      return { reviews, links, meta };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Échec de la récupération des avis du client',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  @Patch(':id/suspend')
  @ApiOperation({ summary: 'Suspendre un avis' })
  @ApiParam({ name: 'id', description: "ID de l'avis", type: Number })
  async suspend(@Param('id') id: string) {
    try {
      const reviewId = parseInt(id);
      if (isNaN(reviewId)) {
        throw new HttpException('ID invalide', HttpStatus.BAD_REQUEST);
      }
      return await this.ClientReviewRestaurantService.suspend(reviewId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: "Échec de la suspension de l'avis",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Rétablir un avis' })
  @ApiParam({ name: 'id', description: "ID de l'avis", type: Number })
  async restore(@Param('id') id: string) {
    try {
      const reviewId = parseInt(id);
      if (isNaN(reviewId)) {
        throw new HttpException('ID invalide', HttpStatus.BAD_REQUEST);
      }
      return await this.ClientReviewRestaurantService.restore(reviewId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: "Échec de la réactivation de l'avis",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un avis' })
  async remove(@Param('id') id: string) {
    try {
      const reviewId = parseInt(id);
      if (isNaN(reviewId)) {
        throw new HttpException('ID invalide', HttpStatus.BAD_REQUEST);
      }
      return this.ClientReviewRestaurantService.remove(+id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: "Échec de la suppression de l'avis",
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
