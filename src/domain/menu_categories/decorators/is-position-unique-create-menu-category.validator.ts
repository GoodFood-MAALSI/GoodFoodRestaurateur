import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPositionUniqueCreateMenuCategoryConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  async validate(position: number, args: ValidationArguments) {
    const obj = args.object as any;
    const restaurantId = obj.restaurantId;

    if (!restaurantId || position == null) {
      return true;
    }

    const existing = await this.menuCategoryRepository.findOne({
      where: { restaurantId, position },
    });

    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `La position ${args.value} est déjà prise pour ce restaurant.`;
  }
}

export function IsPositionUniqueCreateMenuCategory(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositionUniqueCreateMenuCategoryConstraint,
    });
  };
}
