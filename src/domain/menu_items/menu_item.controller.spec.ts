import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from './menu_items.controller';
import { MenuItemsService } from './menu_items.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockMenuItemsService = {
  create: jest.fn((dto: CreateMenuItemDto) => Promise.resolve({ id: 1, ...dto })),
  update: jest.fn((id: number, dto: UpdateMenuItemDto) => Promise.resolve({ id, ...dto })),
  remove: jest.fn((id: number) => Promise.resolve(`Item with ID ${id} deleted`)),
};

class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('MenuItemsController', () => {
  let controller: MenuItemsController;
  let service: MenuItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [
        {
          provide: MenuItemsService,
          useValue: mockMenuItemsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<MenuItemsController>(MenuItemsController);
    service = module.get<MenuItemsService>(MenuItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return created item', async () => {
      const dto: CreateMenuItemDto = {
        name: 'Burger Deluxe',
        price: 12.5,
        description: 'Burger avec supplément',
        picture: null,
        promotion: 15,
        is_available: true,
        position: 1,
        menuCategoryId: 2,
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('update', () => {
    it('should call service.update and return updated item', async () => {
      const updateDto: UpdateMenuItemDto = {
        name: 'Updated Name',
        price: 13.99,
        description: 'Updated desc',
        position: 2,
      };
      const result = await controller.update(1, updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual({ id: 1, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove and return message', async () => {
      const result = await controller.remove(3);
      expect(service.remove).toHaveBeenCalledWith(3);
      expect(result).toBe('Item with ID 3 deleted');
    });
  });
});
