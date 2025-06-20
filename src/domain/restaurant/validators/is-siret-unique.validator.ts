import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';

@ValidatorConstraint({  name: 'IsSiretUnique', async: true })
@Injectable()
export class IsSiretUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(siret: string, args: ValidationArguments) {
    const repo = this.dataSource.getRepository(Restaurant);
    const existing = await repo.findOne({ where: { siret } });
    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ce numéro SIRET est déjà utilisé';
  }
}

export function IsSiretUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSiretUniqueConstraint,
    });
  };
}
