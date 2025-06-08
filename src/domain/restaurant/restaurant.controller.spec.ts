import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from '../utils/pagination';

// Mock du service
const mockRestaurantService = {
  create: jest.fn(async (dto: CreateRestaurantDto & { userId: number }) => ({
    id: 1,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  findAll: jest.fn(async (filters: any, page: number, limit: number) => {
    const allData = [
      {
        id: 1,
        name: 'Restaurant 1',
        description: 'Description 1',
        street_number: '1',
        street: 'Street 1',
        city: 'City 1',
        postal_code: '10000',
        country: 'Country 1',
        email: 'email1@example.com',
        phone_number: '123456789',
        siret: '63201210000012',
        is_open: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Restaurant 2',
        description: 'Description 2',
        street_number: '2',
        street: 'Street 2',
        city: 'City 2',
        postal_code: '20000',
        country: 'Country 2',
        email: 'email2@example.com',
        phone_number: '987654321',
        siret: '63201210000013',
        is_open: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'Restaurant 3',
        description: 'Description 3',
        street_number: '3',
        street: 'Street 3',
        city: 'City 3',
        postal_code: '30000',
        country: 'Country 3',
        email: 'email3@example.com',
        phone_number: '123456789',
        siret: '63201210000014',
        is_open: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const filteredData = allData.filter((r) => {
      // Optionally apply some filter logic if needed
      return true;
    });

    const start = (page - 1) * limit;
    const paginatedData = filteredData.slice(start, start + limit);

    return { restaurants: paginatedData, total: filteredData.length };
  }),
  findOne: jest.fn(async (id: number) => ({
    id,
    name: `Restaurant ${id}`,
    description: `Description ${id}`,
    street_number: `${id}`,
    street: `Street ${id}`,
    city: `City ${id}`,
    postal_code: `${id}0000`,
    country: `Country ${id}`,
    email: `email${id}@example.com`,
    phone_number: '123456789',
    siret: `632012100000${id}`,
    is_open: true,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  update: jest.fn(async (id: number, dto: UpdateRestaurantDto) => ({
    id,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  remove: jest.fn(async (id: number) => {}),
  // addUserToRestaurant is called in controller but missing in mock - let's mock it
  addUserToRestaurant: jest.fn(
    async (restaurantId: number, userId: number) => {},
  ),
};

class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;
  let paginationService: Pagination;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: mockRestaurantService,
        },
        Pagination,
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
    paginationService = module.get<Pagination>(Pagination);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return created restaurant', async () => {
      const createDto: CreateRestaurantDto = {
        name: 'New Restaurant',
        description: 'New Description',
        street_number: '100',
        street: 'New Street',
        city: 'New City',
        postal_code: '12345',
        country: 'New Country',
        email: 'newemail@example.com',
        phone_number: '999888777',
        siret: '632012100000',
        long: 12.3456,
        lat: 65.4321,
        is_open: true,
        restaurantTypeId: 1,
      };

      const mockRequest = {
        user: { id: 5 },
      } as unknown as Request;

      const result = await controller.create(createDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith({ ...createDto, userId: 5 });
      expect(result).toEqual({
        id: 1,
        ...createDto,
        userId: 5,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return paginated restaurants', async () => {
      const mockRequest = {
        url: '/restaurant?page=2&limit=10',
      } as unknown as Request;

      const result = await controller.findAll({}, 2, 10, mockRequest);

      expect(service.findAll).toHaveBeenCalledWith({}, 2, 10);
      expect(result).toHaveProperty('restaurants');
      expect(result).toHaveProperty('links');
      expect(result).toHaveProperty('meta');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and return restaurant', async () => {
      const id = '2';
      const result = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual({
        id: 2,
        name: 'Restaurant 2',
        description: 'Description 2',
        street_number: '2',
        street: 'Street 2',
        city: 'City 2',
        postal_code: '20000',
        country: 'Country 2',
        email: 'email2@example.com',
        phone_number: '123456789',
        siret: '6320121000002',
        is_open: true,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('update', () => {
    it('should call service.update and return updated restaurant', async () => {
      const updateDto: UpdateRestaurantDto = {
        name: 'Updated Restaurant',
        description: 'Updated Description',
        street_number: '200',
        street: 'Updated Street',
        city: 'Updated City',
        postal_code: '54321',
        country: 'Updated Country',
        email: 'updatedemail@example.com',
        phone_number: '111222333',
        siret: '98765432109876',
        is_open: false,
      };

      const result = await controller.update('3', updateDto);

      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({
        id: 3,
        ...updateDto,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success message', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce();

      const result = await controller.remove('4');

      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual({ message: 'Restaurant supprimé avec succès' });
    });
  });
});
