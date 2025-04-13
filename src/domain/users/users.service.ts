import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { EntityCondition } from "src/domain/utils/types/entity-condition.type";
import { NullableType } from "src/domain/utils/types/nullable.type";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser)
      throw new HttpException("User already exists", HttpStatus.CONFLICT);
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findOneUser(options: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne({
      where: options,
    });
  }

  updateUser(id: User["id"], payload: DeepPartial<User>): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async deleteUser(id: User["id"]): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}