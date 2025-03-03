import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = this.restaurantRepository.create(createRestaurantDto)
    return await this.restaurantRepository.save(restaurant);
  }

  async findAll() {
    return await this.restaurantRepository.find();
  }

  async findOne(id: number) {
    return await this.restaurantRepository.findOne({ where: {id}});
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {

    const restaurant = await this.findOne(id);

    if(!restaurant){
      throw new NotFoundException();
    }

    Object.assign(restaurant,updateRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async remove(id: number) {
    const restaurant = await this.findOne(id);

    if(!restaurant){
      throw new NotFoundException();
    }
    return await this.restaurantRepository.remove(restaurant);
  }
}
