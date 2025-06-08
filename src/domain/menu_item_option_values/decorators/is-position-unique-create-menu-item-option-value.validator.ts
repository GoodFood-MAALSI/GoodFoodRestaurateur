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
import { MenuItemOptionValue } from '../entities/menu_item_option_value.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPositionUniqueCreateMenuItemOptionValueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(MenuItemOptionValue)
    private readonly menuItemOptionValueRepository: Repository<MenuItemOptionValue>,
  ) {}

  async validate(position: number, args: ValidationArguments) {
    const obj = args.object as any;
    const menuItemOptionId = obj.menuItemOptionId;

    if (!menuItemOptionId || position == null) {
      return true;
    }

    const existing = await this.menuItemOptionValueRepository.findOne({
      where: { menuItemOptionId, position },
    });

    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `La position ${args.value} est déjà prise pour ce restaurant.`;
  }
}

export function IsPositionUniqueCreateMenuItemOptionValue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositionUniqueCreateMenuItemOptionValueConstraint,
    });
  };
}
