import { ApiProperty } from '@nestjs/swagger';
import { ClientReviewRestaurant } from '../entities/client-review-restaurant.entity';
import { ClientDto } from 'src/domain/interservice/dto/client.dto';

export class ClientReviewRestaurantResponseDto extends ClientReviewRestaurant {
  @ApiProperty({ type: () => ClientDto, required: false })
  client?: ClientDto;
}