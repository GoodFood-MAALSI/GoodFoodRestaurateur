import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantTypeController } from './restaurant_type.controller';
import { RestaurantTypeService } from './restaurant_type.service';
import { CreateRestaurantTypeDto } from './dto/create-restaurant_type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant_type.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockRestaurantTypeService = {
  create: jest.fn((dto: CreateRestaurantTypeDto) => ({ id: 1, ...dto, created_at: new Date(), updated_at: new Date() })),
  findAll: jest.fn(() => [
    { id: 1, name: 'Type 1', created_at: new Date(), updated_at: new Date() },
    { id: 2, name: 'Type 2', created_at: new Date(), updated_at: new Date() },
  ]),
  findOne: jest.fn((id: number) => ({ id: id, name: `Type ${id}`, created_at: new Date(), updated_at: new Date() })),
  update: jest.fn((id: number, dto: UpdateRestaurantTypeDto) => ({ id: id, ...dto, created_at: new Date(), updated_at: new Date() })),
  remove: jest.fn((id: number) => `Restaurant type with ID ${id} deleted`),
};

// Mock du guard d'authentification
class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('RestaurantTypeController', () => {
  let controller: RestaurantTypeController;
  let service: RestaurantTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantTypeController],
      providers: [
        {
          provide: RestaurantTypeService,
          useValue: mockRestaurantTypeService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<RestaurantTypeController>(RestaurantTypeController);
    service = module.get<RestaurantTypeService>(RestaurantTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service create method and return the created restaurant type', () => {
      const createDto: CreateRestaurantTypeDto = { name: 'New Type' };
      const result = controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ id: 1, ...createDto, created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method and return all restaurant types', () => {
      const result = controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Type 1', created_at: expect.any(Date), updated_at: expect.any(Date) },
        { id: 2, name: 'Type 2', created_at: expect.any(Date), updated_at: expect.any(Date) },
      ]);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with the id and return the found restaurant type', () => {
      const result = controller.findOne('2');
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual({ id: 2, name: 'Type 2', created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated restaurant type', () => {
      const updateDto: UpdateRestaurantTypeDto = { name: 'Updated Type' };
      const result = controller.update('3', updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: 3, ...updateDto, created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id and return the result', () => {
      const result = controller.remove('4');
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual('Restaurant type with ID 4 deleted');
    });
  });
});
