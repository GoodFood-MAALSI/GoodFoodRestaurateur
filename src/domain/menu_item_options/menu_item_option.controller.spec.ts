import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionsController } from './menu_item_options.controller';
import { MenuItemOptionsService } from './menu_item_options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { InterserviceAuthGuardFactory } from '../interservice/guards/interservice-auth.guard';
import { HttpModule, HttpService } from '@nestjs/axios'; // Import HttpModule and HttpService
import { UsersService } from '../users/users.service'; // Import UsersService

// --- Mock du service MenuItemOptionsService ---
const mockMenuItemOptionsService = {
  create: jest.fn(async (dto: CreateMenuItemOptionDto, userId: number) => ({
    id: 1,
    ...dto,
    menuItemId: dto.menuItemId,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  update: jest.fn(async (id: number, dto: UpdateMenuItemOptionDto, userId: number) => ({
    id,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  remove: jest.fn(async (id: number, userId: number) => Promise.resolve()),
};

// --- Mock du service UsersService (needed by the guard) ---
const mockUsersService = {
  findOne: jest.fn(), // Or any methods your guard might call
  // Add other methods that your guard might depend on if necessary
};

// --- Mock de HttpService (needed by the guard) ---
// This is typically provided by HttpModule, but if you need to mock specific calls,
// you would create a mock object for HttpService directly.
// For now, importing HttpModule should be sufficient to satisfy the dependency.


// --- Mock de InterserviceAuthGuardFactory ---
// This mock will return a class that acts as the guard.
// It will attach a mock user to the request.
const mockInterserviceAuthGuardFactory = jest.fn((roles: string[]) => {
  return class MockAuthGuard {
    // This mock guard DOES NOT need HttpService or UsersService injected directly.
    // It's just fulfilling the contract of what the factory returns.
    // The *actual* guard (which we are overriding) has these dependencies.
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      // Simulate a user being authenticated and having an ID
      req.user = { id: 123, role: roles[0] || 'restaurateur' };
      return true;
    }
  };
});

describe('MenuItemOptionsController', () => {
  let controller: MenuItemOptionsController;
  let service: MenuItemOptionsService;

  const mockAuthenticatedRequest = {
    user: { id: 123, role: 'restaurateur' },
  } as unknown as Request;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule, // Import HttpModule to provide HttpService
      ],
      controllers: [MenuItemOptionsController],
      providers: [
        {
          provide: MenuItemOptionsService,
          useValue: mockMenuItemOptionsService,
        },
        {
          provide: UsersService, // Provide a mock UsersService
          useValue: mockUsersService,
        },
        // If HttpService needed specific mocking beyond just providing it via HttpModule:
        // {
        //   provide: HttpService,
        //   useValue: {
        //     // mock specific methods of HttpService if needed by your guard
        //     get: jest.fn(),
        //   },
        // },
      ],
    })
      .overrideGuard(InterserviceAuthGuardFactory(['restaurateur']))
      .useValue(new (mockInterserviceAuthGuardFactory(['restaurateur']))())
      .compile();

    controller = module.get<MenuItemOptionsController>(MenuItemOptionsController);
    service = module.get<MenuItemOptionsService>(MenuItemOptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateMenuItemOptionDto = {
      name: 'Option A',
      is_required: true,
      is_multiple_choice: false,
      position: 1,
      menuItemId: 10,
    };

    it('should call service.create with dto and userId and return the created item', async () => {
      mockMenuItemOptionsService.create.mockResolvedValueOnce({
        id: 1,
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await controller.create(createDto, mockAuthenticatedRequest);

      expect(service.create).toHaveBeenCalledWith(createDto, mockAuthenticatedRequest.user.id);
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        name: 'Option A',
        is_required: true,
        is_multiple_choice: false,
        position: 1,
        menuItemId: 10,
      }));
    });
  });

  describe('update', () => {
    const updateDto: UpdateMenuItemOptionDto = {
      name: 'Updated name',
      position: 2,
    };
    const idToUpdate = 5;

    it('should call service.update with id, dto, and userId and return updated item', async () => {
      mockMenuItemOptionsService.update.mockResolvedValueOnce({
        id: idToUpdate,
        ...updateDto,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await controller.update(idToUpdate, updateDto, mockAuthenticatedRequest);

      expect(service.update).toHaveBeenCalledWith(idToUpdate, updateDto, mockAuthenticatedRequest.user.id);
      expect(result).toEqual(expect.objectContaining({
        id: idToUpdate,
        name: 'Updated name',
        position: 2,
      }));
    });
  });

  describe('remove', () => {
    const idToRemove = 3;

    it('should call service.remove with id and userId and return void', async () => {
      mockMenuItemOptionsService.remove.mockResolvedValueOnce(undefined);

      const result = await controller.remove(idToRemove, mockAuthenticatedRequest);

      expect(service.remove).toHaveBeenCalledWith(idToRemove, mockAuthenticatedRequest.user.id);
      expect(result).toBeUndefined();
    });
  });
});