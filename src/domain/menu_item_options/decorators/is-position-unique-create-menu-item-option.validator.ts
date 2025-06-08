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
import { MenuItemOption } from '../entities/menu_item_option.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPositionUniqueCreateMenuItemOptionConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(MenuItemOption)
    private readonly menuItemOptionRepository: Repository<MenuItemOption>,
  ) {}

  async validate(position: number, args: ValidationArguments) {
    const obj = args.object as any;
    const menuItemId = obj.menuItemId;

    if (!menuItemId || position == null) {
      return true;
    }

    const existing = await this.menuItemOptionRepository.findOne({
      where: { menuItemId, position },
    });

    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `La position ${args.value} est déjà prise pour ce restaurant.`;
  }
}

export function IsPositionUniqueCreateMenuItemOption(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositionUniqueCreateMenuItemOptionConstraint,
    });
  };
}
