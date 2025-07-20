import { Test, TestingModule } from '@nestjs/testing';
import { MenuCategoriesController } from './menu_categories.controller';
import { MenuCategoriesService } from './menu_categories.service';
import { CreateMenuCategoryDto } from './dto/create-menu_category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu_category.dto';
import {
  ExecutionContext,
  CanActivate,
  HttpException, // Added HttpException
  HttpStatus, // Added HttpStatus
} from '@nestjs/common';
import { Request } from 'express'; // Import Request
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard'; // Import the actual factory
import { HttpModule, HttpService } from '@nestjs/axios'; // For the guard's dependencies
import { UsersService } from '../users/users.service'; // For the guard's dependencies
import { MenuCategory } from './entities/menu_category.entity'; // Import the entity

// --- Mock du service MenuCategoriesService ---
// Use Partial<Service> and explicitly type jest.fn() for better type safety
const mockMenuCategoriesService: Partial<MenuCategoriesService> = {
  create: jest.fn() as jest.Mock<
    Promise<MenuCategory>,
    [CreateMenuCategoryDto, number]
  >,
  update: jest.fn() as jest.Mock<
    Promise<MenuCategory>,
    [number, UpdateMenuCategoryDto, number]
  >,
  remove: jest.fn() as jest.Mock<Promise<void>, [number, number]>,
  // No need for getMenuItemsByMenuCategoryId or addMenuItemToMenuCategory mocks
  // if the controller under test doesn't call them directly.
};

// --- Mocks for InterserviceAuthGuardFactory dependencies ---
const mockUsersService: Partial<UsersService> = {
  // Add any specific UsersService methods your guard might call if needed
};

const mockHttpService: Partial<HttpService> = {
  // Add any specific HttpService methods your guard might call if needed
};

// --- Mock de InterserviceAuthGuardFactory ---
// This mock will return a class that acts as the guard.
// It will attach a mock user to the request.
const mockInterserviceAuthGuardFactory = jest.fn((roles: string[]) => {
  class MockAuthGuard implements CanActivate {
    // Constructor matches the real guard's constructor
    constructor(private httpService: HttpService, private usersService: UsersService) {}
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      // Simulate a user being authenticated and having an ID
      req.user = { id: 123, role: roles[0] || 'restaurateur' }; // Assign a mock user
      return true; // Always allow activation in tests
    }
  }
  return MockAuthGuard;
});

describe('MenuCategoriesController', () => {
  let controller: MenuCategoriesController;
  let service: MenuCategoriesService;

  // Define a common mock request object for an authenticated user
  const mockAuthenticatedRequest = {
    user: { id: 123, role: 'restaurateur' },
  } as unknown as Request; // Cast to unknown first then Request for complex types

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear mocks before each test

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, // Required for HttpService used by the guard
      ],
      controllers: [MenuCategoriesController],
      providers: [
        {
          provide: MenuCategoriesService,
          useValue: mockMenuCategoriesService, // Use the typed mock
        },
        {
          provide: UsersService, // Provide mock for UsersService
          useValue: mockUsersService,
        },
      ],
    })
      // Override the actual guard used by the controller
      .overrideGuard(InterserviceAuthGuardFactory(['restaurateur']))
      // Use the mock guard factory to provide an instance
      .useValue(new (mockInterserviceAuthGuardFactory(['restaurateur']))(mockHttpService as HttpService, mockUsersService as UsersService))
      .compile();

    controller = module.get<MenuCategoriesController>(MenuCategoriesController);
    service = module.get<MenuCategoriesService>(MenuCategoriesService); // Get the service instance (which is our mock)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});

