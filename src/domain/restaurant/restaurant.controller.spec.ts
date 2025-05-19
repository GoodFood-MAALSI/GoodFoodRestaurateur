import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateMenuCategoryDto } from '../menu_categories/dto/create-menu_category.dto';
import { CreateRestaurantTypeDto } from '../restaurant_type/dto/create-restaurant_type.dto';
import { MenuCategory } from '../menu_categories/entities/menu_category.entity';
import { RestaurantType } from '../restaurant_type/entities/restaurant_type.entity';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { PaginationService } from './pagination.service'; // Import PaginationService
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';

// Mock du service
const mockRestaurantService = {
  create: jest.fn((dto: CreateRestaurantDto) => ({ id: 1, ...dto, created_at: new Date(), updated_at: new Date() })),
  findAll: jest.fn((filters: any, page: number, limit: number) => {
    // Simulate paginated data
    const start = (page - 1) * limit;
    const end = start + limit;
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
        phone_number: '123456789', // Changed to string
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
        phone_number: '987654321', // Changed to string
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
        phone_number: '123456789', // Changed to string
        siret: '63201210000014',
        is_open: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const paginatedData = allData.slice(start, end);
    return Promise.resolve({ data: paginatedData, total: allData.length }); // Return data and total
  }),
  findOne: jest.fn((id: number) => {
    const basePhoneNumber = '123456789';
    return {
      id: id,
      name: `Restaurant ${id}`,
      description: `Description ${id}`,
      street_number: `${id}`,
      street: `Street ${id}`,
      city: `City ${id}`,
      postal_code: `${id}0000`,
      country: `Country ${id}`,
      email: `email${id}@example.com`,
      phone_number: basePhoneNumber, // Corrected phone number type
      siret: `632012100000${id}`,
      is_open: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }),
  update: jest.fn((id: number, dto: UpdateRestaurantDto) => ({ id: id, ...dto, created_at: new Date(), updated_at: new Date() })),
  remove: jest.fn((id: number) => `Restaurant with ID ${id} deleted`),
  getMenuCategoriesByRestaurantId: jest.fn((id: number): Promise<MenuCategory[]> =>  // added getMenuCategoriesByRestaurantId
    Promise.resolve([
      {
        id: 1,
        name: `Category 1 for Restaurant ${id}`,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant: null, // Add this
        menu_items: [],    // Add this
      },
    ]),
  ),
  addMenuCategoryToRestaurant: jest.fn( // added addMenuCategoryToRestaurant
    (id: number, dto: CreateMenuCategoryDto): Promise<MenuCategory> =>
      Promise.resolve({
        id: 1,
        name: dto.name,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant: null, // Added
        menu_items: [],    // Added
      }),
  ),
  addTypeToRestaurant: jest.fn(
    (restaurantId: number, typeId: number): Promise<RestaurantType> =>
      Promise.resolve({
        id: 1,
        name: 'Type Name',
        created_at: new Date(),
        updated_at: new Date(),
        restaurants: [], // Added
      }),
  ),
};

// Mock du guard d'authentification
class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;
  let paginationService: PaginationService; // Get the pagination service
  let restaurantRepository: Repository<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: mockRestaurantService,
        },
        PaginationService, // Provide the PaginationService
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
    paginationService = module.get<PaginationService>(PaginationService); // Inject the service
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

    describe('create', () => {
        it('should call the service create method and return the created restaurant', async () => {
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
                siret: `632012100000`,
                is_open: true,
            };
            // Mock the request object
            const mockRequest = {
                user: { id: 5 }, // Simulate a user with ID 5
                headers: {},
                method: 'POST',
                url: '/restaurants',
                // Ajout d'un maximum de propriétés de Request pour satisfaire le typage
            } as unknown as Request; // Use 'as unknown as Request'

            const result = await controller.create(createDto, mockRequest);
            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(service.addUserToRestaurant).toHaveBeenCalledWith(1, 5);
            expect(result).toEqual({ id: 1, ...createDto, created_at: expect.any(Date), updated_at: expect.any(Date) });
        });
    });

  describe('findAll', () => {
    it('should call the service findAll method with the correct parameters and return paginated data', async () => {
      // Mock the request object needed for generatePaginationMetadata
      const mockRequest = {
        url: '/restaurant?page=2&limit=10', // Example URL for testing
      } as any;

      const result = await controller.findAll({}, 2, 10, mockRequest); // Pass in page and limit
      expect(service.findAll).toHaveBeenCalledWith({}, 2, 10); // Check page and limit
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('links');
      expect(result).toHaveProperty('meta');
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with the id and return the found restaurant', () => {
      const result = controller.findOne('2');
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
        phone_number: '987654321',
        siret: '6320121000002',
        is_open: true,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated restaurant', () => {
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
      const result = controller.update('3', updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: 3, ...updateDto, created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id and return the result', () => {
      const result = controller.remove('4');
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual('Restaurant with ID 4 deleted');
    });
  });
});

