import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Session } from '../session/entities/session.entity';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { NullableType } from '../utils/types/nullable.type';
import { Restaurant, RestaurantStatus } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findOneUser(options: EntityCondition<User>): Promise<NullableType<User>> {
    const user = await this.usersRepository.findOne({
      where: options,
    });
    return user;
  }

  async updateUser(id: User['id'], payload: DeepPartial<User>): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async deleteUser(id: User['id']): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.restaurantRepository.delete({ user: { id } });
    await this.sessionRepository.delete({ user: { id } });
    await this.usersRepository.delete(id);

    return { message: 'L\'utilisateur a été supprimé avec succès' };
  }

  async suspendUser(id: User['id']): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Mettre à jour le statut de l'utilisateur
    await this.usersRepository.update(id, { status: UserStatus.Suspended });

    // Suspendre tous les restaurants associés
    await this.restaurantRepository.update(
      { user: { id } },
      { status: RestaurantStatus.Suspended },
    );
  }

  async restoreUser(id: User['id']): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    // Réactiver l'utilisateur
    await this.usersRepository.update(id, { status: UserStatus.Active });

    // Réactiver tous les restaurants associés
    await this.restaurantRepository.update(
      { user: { id } },
      { status: RestaurantStatus.Active },
    );
  }

  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}