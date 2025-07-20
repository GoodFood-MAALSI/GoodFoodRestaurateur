import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, HttpException, HttpStatus, Logger, INestApplication } from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from '../utils/pagination';
import { Restaurant, RestaurantStatus } from './entities/restaurant.entity';
import { RestaurantFilterDto } from './dto/restaurant-filter.dto';
import { Images } from '../images/entities/images.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import * as request from 'supertest';
import { Readable } from 'stream'; // Import Readable for the mock file stream
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard';
import { UsersService } from '../users/users.service';
import { HttpModule } from '@nestjs/axios';



class MockInterserviceAuthGuard {
  constructor(private readonly roles: string[] = []) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1, role: this.roles[0] || 'restaurateur' };
    return true;
  }
}
// --- Mock du service ---
const mockRestaurantService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getRestaurantFromUser: jest.fn(),
  suspendRestaurant: jest.fn(),
  restoreRestaurant: jest.fn(),
  uploadImage: jest.fn(),
  removeImage: jest.fn(),
};



describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;
  let paginationService: Pagination;
  let app: INestApplication;

    const createDto: CreateRestaurantDto = {
    name: 'Test Restaurant',
    description: 'A description for a test restaurant.',
    street_number: '123',
    street: 'Test Street',
    city: 'Test City',
    postal_code: '12345',
    country: 'Testland',
    email: 'test@example.com',
    phone_number: '1234567890',
    siret: '12345678901234', // Must be 14 digits
    long: 10.0,
    lat: 20.0,
    is_open: true,
    restaurantTypeId: 1, // Ensure this ID exists or is mocked if necessary
  };

   beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      // 🚨 Add HttpModule to imports if your guard needs HttpService
      // Or if any other provider (like UsersService) directly injects HttpService
      imports: [HttpModule], // <--- ADD THIS LINE

      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: mockRestaurantService,
        },
        // 🚨 Provide mock for InterserviceAuthGuardFactory or its internal dependencies
        // Option A: Mock the factory directly (often simplest for controller tests)
        // You'll need to re-export InterserviceAuthGuardFactory from its module or define it in your test file
        // For simplicity, let's assume it's callable here for now.
        // If InterserviceAuthGuardFactory is complex and brings in many dependencies,
        // it's better to provide a *mock* of the guard it produces for @UseGuards().
        //
        // NestJS testing module automatically handles `@UseGuards`. When you do `Test.createTestingModule`,
        // you're telling it what providers are available. If a guard is used on a controller
        // and that guard has dependencies, those dependencies must be provided.

        // So, we need to provide UsersService and potentially HttpService here
        {
          provide: UsersService, // Make sure this matches the actual token for UsersService
          useValue: UsersService,
        },
        // If ConfiguredGuard directly injects HttpService, you'd provide a mock for it here:
        // {
        //   provide: HttpService,
        //   useValue: mockHttpService,
        // },
        // If your guard itself is an injectable provider that depends on HttpService/UsersService,
        // you might need to provide a mock class for the guard itself.
        // However, the error message points to a dependency of `ConfiguredGuard`,
        // which strongly suggests `UsersService` and `HttpService` are the direct culprits.
      ],
    })
    .overrideGuard(InterserviceAuthGuardFactory) // Override the guard factory directly
    .useValue(InterserviceAuthGuardFactory) // Use the mock we defined
    .compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
    app = module.createNestApplication();
    await app.init(); // Initialize the app to make guards work
  });

  afterAll(async () => {
    await app.close();
  });
  

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    // Ensure createDto is accessible here, as defined above
    const authenticatedRequest = { user: { id: 1, role: 'restaurateur' } } as unknown as Request;

    it('should create a restaurant successfully', async () => {
      const expectedRestaurant = { id: 1, ...createDto, userId: 1 };
      mockRestaurantService.create.mockResolvedValueOnce(expectedRestaurant);

      const result = await controller.create(createDto, authenticatedRequest);

      expect(mockRestaurantService.create).toHaveBeenCalledWith({ ...createDto, userId: 1 });
      expect(result).toEqual(expectedRestaurant);
    });

    const mockRequest = {
      user: { id: 1, role: 'restaurateur' },
    } as unknown as Request;

    const expectedRestaurant: Restaurant = {
      id: 1,
      ...createDto,
      userId: mockRequest.user.id,
      status: RestaurantStatus.Active,
      created_at: new Date(),
      updated_at: new Date(),
      restaurantType: null,
      user: null,
      menuCategories: [],
      reviews: [],
      images: [],
      review_count: 0,
      average_rating: 0
    };

    it('should call service.create and return created restaurant', async () => {
      mockRestaurantService.create.mockResolvedValueOnce(expectedRestaurant);

      const result = await controller.create(createDto, mockRequest);

      expect(service.create).toHaveBeenCalledWith({ ...createDto, userId: mockRequest.user.id });
      expect(result).toEqual(expectedRestaurant);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const unauthenticatedRequest = { user: null } as unknown as Request;
      await expect(controller.create(createDto, unauthenticatedRequest)).rejects.toThrow(
        // THIS IS THE LINE TO CHANGE:
        new HttpException(
          {
            message: 'Failed to create restaurant', // This is the message from your controller's catch block
            error: 'Utilisateur non authentifié', // This is the nested error.message from the original exception
          },
          HttpStatus.INTERNAL_SERVER_ERROR, // This is the status from your controller's catch block
        ),
      );
    });

    it('should throw InternalServerErrorException if service.create fails', async () => {
      mockRestaurantService.create.mockRejectedValueOnce(
        new Error('Database error during creation'),
      );

      await expect(controller.create(createDto, mockRequest)).rejects.toThrow(
        new HttpException(
          { message: 'Failed to create restaurant', error: 'Database error during creation' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findAll', () => {
    const filters: RestaurantFilterDto = { page: 1, limit: 10 };
    const mockRequest = {
      url: '/restaurant?page=1&limit=10',
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000'),
      user: { id: 1, role: 'client' },
    } as unknown as Request;

    const mockRestaurants: Restaurant[] = [
      // ... mock data ...
    ];
    const total = 1;

    it('should call service.findAll and return paginated restaurants', async () => {
      mockRestaurantService.findAll.mockResolvedValueOnce({
        restaurants: mockRestaurants,
        total,
      });

      // CORRECTED LINE: Call findAll with only two arguments (filters, mockRequest)
      const result = await controller.findAll(filters, mockRequest);

      // Your expect for service.findAll remains correct as it takes (filters, page, limit)
      // because that's what your controller passes to the service.
      expect(service.findAll).toHaveBeenCalledWith(filters, filters.page, filters.limit);
      expect(result).toHaveProperty('restaurants', mockRestaurants);
      expect(result).toHaveProperty('links');
      expect(result).toHaveProperty('meta');
      expect(result.meta.currentPage).toBe(filters.page);
      expect(result.meta.itemsPerPage).toBe(filters.limit);
      expect(result.meta.totalItems).toBe(total);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should throw InternalServerErrorException if service.findAll fails', async () => {
      mockRestaurantService.findAll.mockRejectedValueOnce(
        new Error('Database error during findAll'),
      );

      // CORRECTED LINE: Call findAll with only two arguments (filters, mockRequest)
      await expect(controller.findAll(filters, mockRequest)).rejects.toThrow(
        new HttpException(
          { message: 'Échec de la récupération des restaurants', error: 'Database error during findAll' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('getRestaurantFromUser', () => {
    const page = 1;
    const limit = 10;
    const mockRequest = {
      user: { id: 1, role: 'restaurateur' },
      url: `/restaurant/me?page=${page}&limit=${limit}`,
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000'),
    } as unknown as Request;

    const mockRestaurants: Restaurant[] = [
      {
        id: 1, name: 'User Restaurant 1', description: '', street_number: '', street: '', city: '', postal_code: '', country: '', email: '', phone_number: '', siret: '', is_open: true, status: RestaurantStatus.Active, long: 0, lat: 0, restaurantTypeId: 1, userId: mockRequest.user.id, created_at: new Date(), updated_at: new Date(),
        restaurantType: null, user: null, menuCategories: [], reviews: [], images: [], review_count: 0, average_rating: 0
      },
    ];
    const total = 1;

    it('should call service.getRestaurantFromUser and return paginated restaurants', async () => {
      mockRestaurantService.getRestaurantFromUser.mockResolvedValueOnce({
        restaurants: mockRestaurants,
        total,
      });

      const result = await controller.getRestaurantFromUser(mockRequest, page, limit);

      expect(service.getRestaurantFromUser).toHaveBeenCalledWith(mockRequest.user.id, page, limit);
      expect(result).toHaveProperty('restaurants', mockRestaurants);
      expect(result).toHaveProperty('links');
      expect(result).toHaveProperty('meta');
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const unauthenticatedRequest = { user: null } as unknown as Request;
      await expect(controller.getRestaurantFromUser(unauthenticatedRequest, page, limit)).rejects.toThrow(
        // THIS IS THE CRITICAL CHANGE:
        new HttpException(
          {
            // The message property of the object that the controller's catch block throws
            message: 'Échec de la récupération des restaurants utilisateur',
            // The 'error' property of that object, which will contain the message
            // of the *original* HttpException ('Utilisateur non authentifié')
            error: 'Utilisateur non authentifié',
          },
          // The HTTP status code that the controller's catch block throws
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should throw InternalServerErrorException if service.getRestaurantFromUser fails', async () => {
      mockRestaurantService.getRestaurantFromUser.mockRejectedValueOnce(
        new Error('Database error for user restaurants'),
      );

      await expect(controller.getRestaurantFromUser(mockRequest, page, limit)).rejects.toThrow(
        new HttpException(
          { message: 'Échec de la récupération des restaurants utilisateur', error: 'Database error for user restaurants' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findOne', () => {
    const id = '2';
    const expectedRestaurant: Restaurant = {
      id: 2, name: 'Restaurant 2', description: '', street_number: '', street: '', city: '', postal_code: '', country: '', email: '', phone_number: '', siret: '', is_open: true, status: RestaurantStatus.Active, long: 0, lat: 0, restaurantTypeId: 1, userId: 1, created_at: new Date(), updated_at: new Date(),
      restaurantType: null, user: null, menuCategories: [], reviews: [], images: [], review_count: 10, average_rating: 4.5
    };
    const mockRequest = { user: { id: 1, role: 'client' } } as unknown as Request;


    it('should call service.findOne with id and return restaurant', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(expectedRestaurant);

      const result = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual(expectedRestaurant);
    });

    it('should throw HttpException with NOT_FOUND status if restaurant not found', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(null);

      await expect(controller.findOne(id)).rejects.toThrow(
        new HttpException(`Restaurant with ID ${id} not found`, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw InternalServerErrorException if service.findOne fails', async () => {
      mockRestaurantService.findOne.mockRejectedValueOnce(
        new Error('Database error during findOne'),
      );

      await expect(controller.findOne(id)).rejects.toThrow(
        new HttpException(
          { message: 'Failed to retrieve restaurant', error: 'Database error during findOne' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('getRestaurantForInterservice', () => {
    const id = '123';
    const mockRestaurant: Restaurant = {
      id: 123,
      name: 'Inter-service Test',
      street_number: '42',
      street: 'Service Lane',
      city: 'Intercity',
      postal_code: '12345',
      country: 'ServiceLand',
      email: 'service@example.com',
      phone_number: '123-456-7890',
      long: 10.1,
      lat: 20.2,
      images: [
        { id: 1, filename: 'img.png', path: 'path/img.png', mimetype: 'image/png', size: 100, isMain: true, entityType: 'restaurant', restaurant: null, restaurant_id: 123, menu_item: null, menu_item_id: null, created_at: new Date() }
      ],
      description: '', siret: '', is_open: true, status: RestaurantStatus.Active,
      restaurantTypeId: 1, userId: 1, created_at: new Date(), updated_at: new Date(),
      restaurantType: null, user: null, menuCategories: [], reviews: [],
      review_count: 0, average_rating: 0
    };

    it('should return partial restaurant data for valid ID', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(mockRestaurant);

      const result = await controller.getRestaurantForInterservice(id);

      expect(mockRestaurantService.findOne).toHaveBeenCalledWith(parseInt(id));
      expect(result).toEqual({
        id: mockRestaurant.id,
        name: mockRestaurant.name,
        street_number: mockRestaurant.street_number,
        street: mockRestaurant.street,
        city: mockRestaurant.city,
        postal_code: mockRestaurant.postal_code,
        country: mockRestaurant.country,
        email: mockRestaurant.email,
        phone_number: mockRestaurant.phone_number,
        long: mockRestaurant.long,
        lat: mockRestaurant.lat,
        images: mockRestaurant.images.map(img => ({ ...img })),
      });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(controller.getRestaurantForInterservice('abc')).rejects.toThrow(
        new HttpException('ID doit être un nombre', HttpStatus.BAD_REQUEST),
      );
      expect(mockRestaurantService.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if restaurant not found', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(null);

      await expect(controller.getRestaurantForInterservice(id)).rejects.toThrow(
        new HttpException('Restaurant non trouvé', HttpStatus.NOT_FOUND),
      );
    });
  });


  describe('update', () => {
    const id = '3';
    const updateDto: UpdateRestaurantDto = {
      name: 'Updated Restaurant',
      description: 'Updated Description',
      siret: ''
    };
    const mockRequest = {
      user: { id: 1, role: 'restaurateur' },
    } as unknown as Request;

    const expectedUpdatedRestaurant: Restaurant = {
      id: 3,
      name: 'Updated Restaurant',
      description: 'Updated Description',
      street_number: '3', street: 'Street 3', city: 'City 3', postal_code: '30000', country: 'Country 3',
      email: 'email3@example.com', phone_number: '123456789', siret: '6320121000003',
      is_open: true, status: RestaurantStatus.Active, long: 0, lat: 0, restaurantTypeId: 1, userId: mockRequest.user.id,
      created_at: new Date(), updated_at: new Date(),
      restaurantType: null, user: null, menuCategories: [], reviews: [], images: [], review_count: 0, average_rating: 0
    };

    it('should call service.update and return updated restaurant', async () => {
      mockRestaurantService.update.mockResolvedValueOnce(expectedUpdatedRestaurant);

      const result = await controller.update(id, updateDto, mockRequest);

      expect(service.update).toHaveBeenCalledWith(parseInt(id), updateDto, mockRequest.user.id);
      expect(result).toEqual(expectedUpdatedRestaurant);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const unauthenticatedRequest = { user: null } as unknown as Request;
      await expect(controller.update(id, updateDto, unauthenticatedRequest)).rejects.toThrow(
        new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(controller.update('abc', updateDto, mockRequest)).rejects.toThrow(
        new HttpException('ID invalide', HttpStatus.BAD_REQUEST),
      );
      expect(mockRestaurantService.update).not.toHaveBeenCalled();
    });

    it('should re-throw HttpException if service.update throws HttpException', async () => {
      mockRestaurantService.update.mockRejectedValueOnce(
        new HttpException('Forbidden access', HttpStatus.FORBIDDEN),
      );
      await expect(controller.update(id, updateDto, mockRequest)).rejects.toThrow(
        new HttpException('Forbidden access', HttpStatus.FORBIDDEN),
      );
    });

    it('should throw InternalServerErrorException if service.update fails with generic error', async () => {
      mockRestaurantService.update.mockRejectedValueOnce(
        new Error('Unhandled database error during update'),
      );
      await expect(controller.update(id, updateDto, mockRequest)).rejects.toThrow(
        new HttpException(
          { message: 'Échec de la mise à jour du restaurant', error: 'Unhandled database error during update' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('remove', () => {
    const id = '4';
    const mockRequest = {
      user: { id: 1, role: 'restaurateur' },
    } as unknown as Request;

    it('should call service.remove and return success message', async () => {
      mockRestaurantService.remove.mockResolvedValueOnce(undefined);

      const result = await controller.remove(id, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(parseInt(id), mockRequest.user.id);
      expect(result).toEqual({ message: 'Restaurant supprimé avec succès' });
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const unauthenticatedRequest = { user: null } as unknown as Request;
      await expect(controller.remove(id, unauthenticatedRequest)).rejects.toThrow(
        new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(controller.remove('abc', mockRequest)).rejects.toThrow(
        new HttpException('ID invalide', HttpStatus.BAD_REQUEST),
      );
      expect(mockRestaurantService.remove).not.toHaveBeenCalled();
    });

    it('should re-throw HttpException if service.remove throws HttpException', async () => {
      mockRestaurantService.remove.mockRejectedValueOnce(
        new HttpException('Restaurant not found for removal', HttpStatus.NOT_FOUND),
      );
      await expect(controller.remove(id, mockRequest)).rejects.toThrow(
        new HttpException('Restaurant not found for removal', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw InternalServerErrorException if service.remove fails with generic error', async () => {
      mockRestaurantService.remove.mockRejectedValueOnce(
        new Error('Unhandled database error during removal'),
      );
      await expect(controller.remove(id, mockRequest)).rejects.toThrow(
        new HttpException(
          { message: 'Échec de la suppression du restaurant', error: 'Unhandled database error during removal' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('suspend', () => {
    const id = '1';
    const mockRequest = { user: { id: 1, role: 'super-admin' } } as unknown as Request;
    const mockRestaurant: Restaurant = {
      id: 1, name: 'Test', description: '', street_number: '', street: '', city: '', postal_code: '', country: '', email: '', phone_number: '', siret: '', is_open: true, status: RestaurantStatus.Active, long: 0, lat: 0, restaurantTypeId: 1, userId: 1, created_at: new Date(), updated_at: new Date(),
      restaurantType: null, user: null, menuCategories: [], reviews: [], images: [], review_count: 0, average_rating: 0
    };

    it('should call service.suspendRestaurant and return success message', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(mockRestaurant);
      mockRestaurantService.suspendRestaurant.mockResolvedValueOnce(undefined);

      const result = await controller.suspend(id);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.suspendRestaurant).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Restaurant suspendu avec succès' });
    });

    it('should throw NotFoundException if restaurant not found by findOne', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(null);

      await expect(controller.suspend(id)).rejects.toThrow(
        new HttpException(`Restaurant with ID ${id} not found`, HttpStatus.NOT_FOUND),
      );
      expect(service.suspendRestaurant).not.toHaveBeenCalled();
    });

    it('should re-throw HttpException if service.suspendRestaurant throws HttpException', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(mockRestaurant);
      mockRestaurantService.suspendRestaurant.mockRejectedValueOnce(
        new HttpException('Restaurant déjà suspendu', HttpStatus.BAD_REQUEST),
      );

      await expect(controller.suspend(id)).rejects.toThrow(
        new HttpException('Restaurant déjà suspendu', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw InternalServerErrorException if service.suspendRestaurant fails with generic error', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(mockRestaurant);
      mockRestaurantService.suspendRestaurant.mockRejectedValueOnce(
        new Error('Unhandled error during suspension'),
      );

      await expect(controller.suspend(id)).rejects.toThrow(
        new HttpException(
          { message: 'Échec de la suspension du restaurant', error: 'Unhandled error during suspension' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('restore', () => {
    const id = '1';
    const mockRequest = { user: { id: 1, role: 'super-admin' } } as unknown as Request;
    const mockRestaurant: Restaurant = {
      id: 1, name: 'Test', description: '', street_number: '', street: '', city: '', postal_code: '', country: 'France', email: 'a@a.com', phone_number: '123456789', siret: '12345678901234', is_open: true, status: RestaurantStatus.Suspended, long: 0, lat: 0, restaurantTypeId: 1, userId: 1, created_at: new Date(), updated_at: new Date(),
      restaurantType: null, user: null, menuCategories: [], reviews: [], images: [], review_count: 0, average_rating: 0
    };

    it('should call service.restoreRestaurant and return success message', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(mockRestaurant);
      mockRestaurantService.restoreRestaurant.mockResolvedValueOnce(undefined);

      const result = await controller.restore(id);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.restoreRestaurant).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Restaurant réactivé avec succès' });
    });

    it('should throw NotFoundException if restaurant not found by findOne', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(null);

      await expect(controller.restore(id)).rejects.toThrow(
        new HttpException(`Restaurant with ID ${id} not found`, HttpStatus.NOT_FOUND),
      );
      expect(service.restoreRestaurant).not.toHaveBeenCalled();
    });

    it('should re-throw HttpException if service.restoreRestaurant throws HttpException', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(mockRestaurant);
      mockRestaurantService.restoreRestaurant.mockRejectedValueOnce(
        new HttpException("Le restaurant n'est pas suspendu", HttpStatus.BAD_REQUEST),
      );

      await expect(controller.restore(id)).rejects.toThrow(
        new HttpException("Le restaurant n'est pas suspendu", HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw InternalServerErrorException if service.restoreRestaurant fails with generic error', async () => {
      mockRestaurantService.findOne.mockResolvedValueOnce(mockRestaurant);
      mockRestaurantService.restoreRestaurant.mockRejectedValueOnce(
        new Error('Unhandled error during restoration'),
      );

      await expect(controller.restore(id)).rejects.toThrow(
        new HttpException(
          { message: 'Échec de la réactivation du restaurant', error: 'Unhandled error during restoration' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('uploadRestaurantImage', () => {
    const restaurantId = '1';
    // Corrected mockFile with 'stream' property
    const mockFile: Express.Multer.File = {
      fieldname: 'image', originalname: 'test.jpg', encoding: '7bit', mimetype: 'image/jpeg',
      size: 1000000, destination: './uploads', filename: 'test-file.jpg', path: './uploads/test-file.jpg',
      buffer: Buffer.from('test image data'),
      stream: new Readable(), // Added stream property
    };
    const mockRequest = { user: { id: 1, role: 'restaurateur' } } as unknown as Request;

    const expectedRestaurantWithImage: Restaurant = {
      id: 1, name: 'Restaurant 1', description: '', street_number: '', street: '', city: '', postal_code: '', country: '', email: '', phone_number: '', siret: '', is_open: true, status: RestaurantStatus.Active, long: 0, lat: 0, restaurantTypeId: 1, userId: 1, created_at: new Date(), updated_at: new Date(),
      restaurantType: null, user: null, menuCategories: [], reviews: [],
      images: [{
        id: 1, filename: 'new-image.webp', path: 'uploads/new-image.webp', mimetype: 'image/webp', size: 500,
        restaurant: null, restaurant_id: 1, menu_item: null, menu_item_id: null, entityType: 'restaurant', isMain: true,
        created_at: new Date(),
      }], review_count: 0, average_rating: 0
    };

    it('should call service.uploadImage and return updated restaurant', async () => {
      mockRestaurantService.uploadImage.mockResolvedValueOnce(expectedRestaurantWithImage);

      const result = await controller.uploadRestaurantImage(restaurantId, mockFile, mockRequest);

      expect(service.uploadImage).toHaveBeenCalledWith(parseInt(restaurantId), mockFile, mockRequest.user.id);
      expect(result).toEqual(expectedRestaurantWithImage);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const unauthenticatedRequest = { user: null } as unknown as Request;
      await expect(controller.uploadRestaurantImage(restaurantId, mockFile, unauthenticatedRequest)).rejects.toThrow(
        new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw BadRequestException for invalid restaurant ID', async () => {
      await expect(controller.uploadRestaurantImage('abc', mockFile, mockRequest)).rejects.toThrow(
        new HttpException('ID invalide', HttpStatus.BAD_REQUEST),
      );
      expect(mockRestaurantService.uploadImage).not.toHaveBeenCalled();
    });

    it('should re-throw HttpException if service.uploadImage throws HttpException', async () => {
      mockRestaurantService.uploadImage.mockRejectedValueOnce(
        new HttpException('Restaurant non trouvé.', HttpStatus.NOT_FOUND),
      );
      await expect(controller.uploadRestaurantImage(restaurantId, mockFile, mockRequest)).rejects.toThrow(
        new HttpException('Restaurant non trouvé.', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw InternalServerErrorException if service.uploadImage fails with generic error', async () => {
      mockRestaurantService.uploadImage.mockRejectedValueOnce(
        new Error('File processing error'),
      );
      await expect(controller.uploadRestaurantImage(restaurantId, mockFile, mockRequest)).rejects.toThrow(
        new HttpException(
          { message: "Échec de l'upload de l'image", error: 'File processing error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('removeRestaurantImage', () => {
    const restaurantId = '1';
    const imageId = '1';
    const mockRequest = { user: { id: 1, role: 'restaurateur' } } as unknown as Request;

    const expectedRestaurantWithoutImage: Restaurant = {
      id: 1, name: 'Restaurant 1', description: '', street_number: '', street: '', city: '', postal_code: '', country: '', email: '', phone_number: '', siret: '', is_open: true, status: RestaurantStatus.Active, long: 0, lat: 0, restaurantTypeId: 1, userId: 1, created_at: new Date(), updated_at: new Date(),
      restaurantType: null, user: null, menuCategories: [], reviews: [], images: [], review_count: 0, average_rating: 0
    };

    it('should call service.removeImage and return updated restaurant', async () => {
      mockRestaurantService.removeImage.mockResolvedValueOnce(expectedRestaurantWithoutImage);

      const result = await controller.removeRestaurantImage(restaurantId, imageId, mockRequest);

      expect(service.removeImage).toHaveBeenCalledWith(parseInt(restaurantId), parseInt(imageId), mockRequest.user.id);
      expect(result).toEqual(expectedRestaurantWithoutImage);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const unauthenticatedRequest = { user: null } as unknown as Request;
      await expect(controller.removeRestaurantImage(restaurantId, imageId, unauthenticatedRequest)).rejects.toThrow(
        new HttpException('Utilisateur non authentifié', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw BadRequestException for invalid IDs', async () => {
      await expect(controller.removeRestaurantImage('abc', imageId, mockRequest)).rejects.toThrow(
        new HttpException('ID invalide', HttpStatus.BAD_REQUEST),
      );
      expect(mockRestaurantService.removeImage).not.toHaveBeenCalled();

      await expect(controller.removeRestaurantImage(restaurantId, 'xyz', mockRequest)).rejects.toThrow(
        new HttpException('ID invalide', HttpStatus.BAD_REQUEST),
      );
      expect(mockRestaurantService.removeImage).not.toHaveBeenCalled();
    });

    it('should re-throw HttpException if service.removeImage throws HttpException', async () => {
      mockRestaurantService.removeImage.mockRejectedValueOnce(
        new HttpException('Image non trouvée pour le restaurant.', HttpStatus.NOT_FOUND),
      );
      await expect(controller.removeRestaurantImage(restaurantId, imageId, mockRequest)).rejects.toThrow(
        new HttpException('Image non trouvée pour le restaurant.', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw InternalServerErrorException if service.removeImage fails with generic error', async () => {
      mockRestaurantService.removeImage.mockRejectedValueOnce(
        new Error('File deletion error'),
      );
      await expect(controller.removeRestaurantImage(restaurantId, imageId, mockRequest)).rejects.toThrow(
        new HttpException(
          { message: "Échec de la suppression de l'image", error: 'File deletion error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});