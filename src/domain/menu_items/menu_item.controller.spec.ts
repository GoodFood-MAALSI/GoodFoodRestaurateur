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
    it('should call the service create method and return the created item', () => {
      const createDto: CreateMenuItemDto = {
        name: 'New Item',
        price: 15.99,
        description: 'New Description',
        promotion: 20,
        is_available: false,
      };
      const result = controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ id: '1', ...createDto });
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method and return all items', () => {
      const result = controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: '1',
          name: 'Burger',
          price: 10.99,
          description: 'Delicious burger',
          picture: 'base64_image_1',
          promotion: 0,
          isAvailable: true,
        },
        {
          id: '2',
          name: 'Pizza',
          price: 12.99,
          description: 'Tasty pizza',
          picture: 'base64_image_2',
          promotion: 10,
          isAvailable: true,
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with the id and return the found item', () => {
      const result = controller.findOne('2');
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual({
        id: '2',
        name: 'Item 2',
        price: 5,
        description: 'Description for item 2',
        picture: 'base64_image_2',
        promotion: 10,
        isAvailable: true,
      });
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated item', () => {
      const updateDto: UpdateMenuItemDto = { name: 'Updated Item', price: 19.99, description: 'Updated Description', promotion: 25, is_available: false };
      const result = controller.update('3', updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: '3', ...updateDto });
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
