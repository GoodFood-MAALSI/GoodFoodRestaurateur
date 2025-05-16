import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantTypeDto } from './dto/create-restaurant_type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant_type.dto';
import { RestaurantType } from './entities/restaurant_type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class RestaurantTypeService {
  constructor(
    @InjectRepository(RestaurantType)
    private readonly restaurantTypeRepository: Repository<RestaurantType>,
    @InjectRepository(Restaurant)
    private readonly restaurant_repository: Repository<Restaurant>,
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

  async addTypeToRestaurant(restaurant_id: number, create_restaurant_type_dto: CreateRestaurantTypeDto): Promise<RestaurantType> {
    const restaurant = await this.restaurant_repository.findOne({ where: { id: restaurant_id }, relations: ['restaurant_type'] }); 

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${restaurant_id} non trouvé`);
    }

    let restaurantType = await this.restaurantTypeRepository.findOne({
      where: { name: create_restaurant_type_dto.name },
    });

    if (!restaurantType) {
      restaurantType = this.restaurantTypeRepository.create({
        name: create_restaurant_type_dto.name,
      });
      restaurantType = await this.restaurantTypeRepository.save(restaurantType);
    }

    restaurant.restaurant_type = restaurantType;
    await this.restaurant_repository.save(restaurant);

    restaurantType.restaurants = [...(restaurantType.restaurants || []), restaurant];
    await this.restaurantTypeRepository.save(restaurantType);
    return restaurantType;
  }
}
