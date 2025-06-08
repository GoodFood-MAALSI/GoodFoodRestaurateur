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
import { MenuItem } from '../entities/menu_item.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPositionUniqueCreateMenuItemConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  async validate(position: number, args: ValidationArguments) {
    const obj = args.object as any;
    const menuCategoryId = obj.menuCategoryId;

    if (!menuCategoryId || position == null) {
      return true;
    }

    const existing = await this.menuItemRepository.findOne({
      where: { menuCategoryId, position },
    });

    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return `La position ${args.value} est déjà prise pour cette categorie de menu.`;
  }
}

export function IsPositionUniqueCreateMenuItem(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositionUniqueCreateMenuItemConstraint,
    });
  };
}
