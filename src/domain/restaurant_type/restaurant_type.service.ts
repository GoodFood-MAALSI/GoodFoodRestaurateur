import { Injectable } from '@nestjs/common';
import { RestaurantType } from './entities/restaurant_type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantTypeService {
  constructor(
    @InjectRepository(RestaurantType)
    private readonly restaurantTypeRepository: Repository<RestaurantType>,
  ) {}

  async findAll() {
    return await this.restaurantTypeRepository.find();
  }
}
