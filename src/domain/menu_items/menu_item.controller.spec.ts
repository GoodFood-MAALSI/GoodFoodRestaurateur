import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from './menu_items.controller';
import { MenuItemsService } from './menu_items.service';
import { CreateMenuItemDto } from './dto/create-menu_item.dto';
import { UpdateMenuItemDto } from './dto/update-menu_item.dto';
import { MenuItemOption } from '../menu_item_options/entities/menu_item_option.entity';
import { CreateMenuItemOptionDto } from '../menu_item_options/dto/create-menu_item_option.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockMenuItemsService = {
  create: jest.fn((dto: CreateMenuItemDto) => ({ id: '1', ...dto })),
  findAll: jest.fn(() => [
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
  ]),
  findOne: jest.fn((id: number) => ({
    id: id.toString(),
    name: `Item ${id}`,
    price: id * 2.5,
    description: `Description for item ${id}`,
    picture: `base64_image_${id}`,
    promotion: id * 5,
    isAvailable: true,
  })),
  update: jest.fn((id: number, dto: UpdateMenuItemDto) => ({ id: id.toString(), ...dto })),
  remove: jest.fn((id: number) => `Item with ID ${id} deleted`),
  getMenuOptionsByMenuItemId: jest.fn((id: number): Promise<MenuItemOption[]> =>
    Promise.resolve([{ 
      id: 1, // Changed to number
      name: 'Option 1', 
      is_required: true, 
      is_multiple_choice: false,
      created_at: new Date(),
      updated_at: new Date(),
      menu_item: null,
      menu_item_option_values: [],
    } as MenuItemOption]),
  ),
  addMenuItemOptionToMenuItem: jest.fn(
    (id: number, dto: CreateMenuItemOptionDto): Promise<MenuItemOption> =>
      Promise.resolve({ 
        id: 1, // Changed to number
        name: dto.name, 
        is_required: dto.is_required, 
        is_multiple_choice: dto.is_multiple_choice,
        created_at: new Date(),
        updated_at: new Date(),
        menu_item: null,
        menu_item_option_values: [],
      } as MenuItemOption),
  ),
};

// Mock du guard d'authentification
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
        picture: 'new_base64_image',
        promotion: 20,
        isAvailable: false,
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
      const updateDto: UpdateMenuItemDto = { name: 'Updated Item', price: 19.99, description: 'Updated Description', picture: 'updated_base64_image', promotion: 25, isAvailable: false };
      const result = controller.update('3', updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: '3', ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id and return the result', () => {
      const result = controller.remove('4');
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual('Item with ID 4 deleted');
    });
  });

  describe('findItemsByCategories', () => {
    it('should call the service getMenuOptionsByMenuItemId method and return the options', async () => {
      const result = await controller.findItemsByCategories('5');
      expect(service.getMenuOptionsByMenuItemId).toHaveBeenCalledWith(5);
      expect(result).toEqual([{ 
        id: 1,
        name: 'Option 1', 
        is_required: true, 
        is_multiple_choice: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        menu_item: null,
        menu_item_option_values: [],
      }]);
    });
  });

  describe('addItemOptionToItem', () => {
    it('should call the service addMenuItemOptionToMenuItem method and return the added option', async () => {
      const createOptionDto: CreateMenuItemOptionDto = { name: 'New Option', is_required: true, is_multiple_choice: false };
      const result = await controller.addItemOptionToItem('6', createOptionDto);
      expect(service.addMenuItemOptionToMenuItem).toHaveBeenCalledWith(6, createOptionDto);
      expect(result).toEqual({ 
        id: 1,
        name: 'New Option', 
        is_required: true, 
        is_multiple_choice: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        menu_item: null,
        menu_item_option_values: [],
      });
    });
  });
});

