import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Restaurant } from '../restaurant/entities/restaurant.entity'; // Import Restaurant entity
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockUsersService = {
  findOneUser: jest.fn((options: { id: number }) => { // Changed parameter type
    if (options.id === 1) {
      return { id: 1, first_name: 'John', last_name: 'Doe' };
    }
    return null; // Simulate user not found
  }),
  updateUser: jest.fn((id: number, dto: UpdateUserDto) => {
    if (id === 1) {
      return { id: 1, ...dto };
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND); // Simulate user not found
  }),
  deleteUser: jest.fn((id: number) => {
    if (id === 1) {
      return Promise.resolve();
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND); // Simulate user not found
  }),
  getRestaurantsByUserId: jest.fn((userId: number) => {
    if (userId === 1) {
      return Promise.resolve([
        { id: 101, name: 'Restaurant A' },
        { id: 102, name: 'Restaurant B' },
      ] as Restaurant[]);
    } else if (userId === 2) {
      return Promise.resolve([]); // Return empty array for user 2
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }),
};

// Mock du guard d'authentification
class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const result = await controller.findOne('1');
      expect(service.findOneUser).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ id: 1, first_name: 'John', last_name: 'Doe' });
    });

    it('should throw HttpException if user not found', async () => {
      try {
        await controller.findOne('2');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User not found');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDto = { first_name: 'Updated John', last_name: 'Doe' };
      const result = await controller.update('1', updateDto);
      expect(service.updateUser).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual({ id: 1, first_name: 'Updated John', last_name: 'Doe' });
    });

    it('should throw HttpException if user not found', async () => {
      const updateDto: UpdateUserDto = { first_name: 'Updated John', last_name: 'Doe' };
      try {
        await controller.update('2', updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User not found');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const result = await controller.remove('1');
      expect(service.deleteUser).toHaveBeenCalledWith(1);
    });

    it('should throw HttpException if user not found', async () => {
      try {
        await controller.remove('2');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User not found');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('getRestaurantsByUserId', () => {
    it('should return restaurants for a given user ID', async () => {
      const result = await controller.getRestaurantsByUserId('1');
      expect(service.getRestaurantsByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual([
        { id: 101, name: 'Restaurant A' },
        { id: 102, name: 'Restaurant B' },
      ]);
    });

    it('should return empty array if user has no restaurants', async () => {
      const result = await controller.getRestaurantsByUserId('2');
      expect(service.getRestaurantsByUserId).toHaveBeenCalledWith(2);
      expect(result).toEqual([]);
    });

    it('should throw HttpException if user not found', async () => {
      try {
        await controller.getRestaurantsByUserId('3');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User not found');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});

