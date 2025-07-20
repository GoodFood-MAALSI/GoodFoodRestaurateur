import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionValuesController } from './menu_item_option_values.controller';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';
import { HttpException, HttpStatus, ExecutionContext, CanActivate } from '@nestjs/common'; // Added CanActivate
import { Request } from 'express'; // Import Request
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard'; // Import the actual factory
import { HttpModule, HttpService } from '@nestjs/axios'; // Import HttpModule and HttpService
import { UsersService } from '../users/users.service'; // Import UsersService
import { MenuItemOptionValue } from './entities/menu_item_option_value.entity'; // Import the entity

// --- Mock du service MenuItemOptionValuesService ---
// Use Partial<Service> and explicitly type jest.fn() for better type safety
const mockMenuItemOptionValuesService: Partial<MenuItemOptionValuesService> = {
  create: jest.fn() as jest.Mock<
    Promise<MenuItemOptionValue>,
    [CreateMenuItemOptionValueDto, number]
  >,
  update: jest.fn() as jest.Mock<
    Promise<MenuItemOptionValue>,
    [number, UpdateMenuItemOptionValueDto, number]
  >,
  remove: jest.fn() as jest.Mock<Promise<void>, [number, number]>,
  findOne: jest.fn() as jest.Mock<Promise<MenuItemOptionValue | null>, [number]>, // Added findOne mock
};

// --- Mock du service UsersService (needed by the guard) ---
const mockUsersService: Partial<UsersService> = {

};

// --- Mock de HttpService (needed by the guard) ---
const mockHttpService: Partial<HttpService> = {
  // Add any specific HttpService methods your guard uses if needed, e.g.:
  // get: jest.fn(() => of({ data: {}, status: 200 })),
};

// --- Mock de InterserviceAuthGuardFactory ---
// This mock will return a class that acts as the guard.
// It will attach a mock user to the request.
const mockInterserviceAuthGuardFactory = jest.fn((roles: string[]) => {
  class MockAuthGuard implements CanActivate {
    constructor(private httpService: HttpService, private usersService: UsersService) {}
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      // Simulate a user being authenticated and having an ID
      // You can adjust the user ID and role as needed for specific tests
      req.user = { id: 123, role: roles[0] || 'restaurateur' };
      return true; // Always allow activation in tests
    }
  }
  return MockAuthGuard;
});

describe('MenuItemOptionValuesController', () => {
  let controller: MenuItemOptionValuesController;
  let service: MenuItemOptionValuesService;

  // Define a common mock request object for authenticated user
  const mockAuthenticatedRequest = {
    user: { id: 123, role: 'restaurateur' },
  } as unknown as Request;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, // Provide HttpService dependency for the guard
      ],
      controllers: [MenuItemOptionValuesController],
      providers: [
        {
          provide: MenuItemOptionValuesService,
          useValue: mockMenuItemOptionValuesService,
        },
        {
          provide: UsersService, // Provide a mock UsersService
          useValue: mockUsersService,
        },
      ],
    })
      // Override the guard used by the controller
      .overrideGuard(InterserviceAuthGuardFactory(['restaurateur'])) // Specify the guard being used
      .useValue(new (mockInterserviceAuthGuardFactory(['restaurateur']))(mockHttpService as HttpService, mockUsersService as UsersService)) // Instantiate the mock guard class
      .compile();

    controller = module.get<MenuItemOptionValuesController>(MenuItemOptionValuesController);
    service = module.get<MenuItemOptionValuesService>(MenuItemOptionValuesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
