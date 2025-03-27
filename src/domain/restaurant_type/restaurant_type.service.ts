import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantTypeDto } from './dto/create-restaurant_type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant_type.dto';
import { RestaurantType } from './entities/restaurant_type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantTypeService {
  constructor(
     @InjectRepository(RestaurantType)
     private readonly restaurantTypeRepository: Repository<RestaurantType>,
   ) {}
 
   async create(createRestaurantDto: CreateRestaurantTypeDto) {
     const restaurantType = this.restaurantTypeRepository.create(createRestaurantDto)
     return await this.restaurantTypeRepository.save(restaurantType);
   }
 
   async findAll() {
     return await this.restaurantTypeRepository.find();
   }
 
   async findOne(id: number) {
     return await this.restaurantTypeRepository.findOne({ where: {id}});
   }
 
   async update(id: number, updateRestaurantTypeDto: UpdateRestaurantTypeDto) {
 
     const restaurantType = await this.findOne(id);
 
     if(!restaurantType){
       throw new NotFoundException();
     }
 
     Object.assign(restaurantType,updateRestaurantTypeDto);
     return await this.restaurantTypeRepository.save(restaurantType);
   }
 
   async remove(id: number) {
     const restaurantType = await this.findOne(id);
 
     if(!restaurantType){
       throw new NotFoundException();
     }
     return await this.restaurantTypeRepository.remove(restaurantType);
   }
}
