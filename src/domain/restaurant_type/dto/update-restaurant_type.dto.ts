import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantTypeDto } from './create-restaurant_type.dto';

export class UpdateRestaurantTypeDto extends PartialType(CreateRestaurantTypeDto) {}
