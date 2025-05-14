import { Test, TestingModule } from '@nestjs/testing';
import { MenuCategoriesController } from './menu_categories.controller';
import { MenuCategoriesService } from './menu_categories.service';
import { CreateMenuCategoryDto } from './dto/create-menu_category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu_category.dto';
import { MenuItem } from '../menu_items/entities/menu_item.entity';
import { CreateMenuItemDto } from '../menu_items/dto/create-menu_item.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockMenuCategoriesService = {
  create: jest.fn((dto: CreateMenuCategoryDto) => ({ id: 1, ...dto, created_at: new Date(), updated_at: new Date() })),
  findAll: jest.fn(() => [
    { id: 1, name: 'Category 1', created_at: new Date(), updated_at: new Date() },
    { id: 2, name: 'Category 2', created_at: new Date(), updated_at: new Date() },
  ]),
  findOne: jest.fn((id: number) => ({ id: id, name: `Category ${id}`, created_at: new Date(), updated_at: new Date() })),
  update: jest.fn((id: number, dto: UpdateMenuCategoryDto) => ({ id: id, ...dto, created_at: new Date(), updated_at: new Date() })),
  remove: jest.fn((id: number) => `Category with ID ${id} deleted`),
  getMenuItemsByMenuCategoryId: jest.fn((id: number): Promise<MenuItem[]> =>
    Promise.resolve([
      {
        id: 1,
        name: `Item 1 in Category ${id}`,
        price: 10.99,
        description: 'Description 1',
        picture: 'base64_image_1',
        promotion: 0,
        isAvailable: true,
        created_at: new Date(),
        updated_at: new Date(),
        is_available: true,  // Added
        menu_category: null, // Added
        menu_item_options: [], // Added
      },
    ]),
  ),
  addMenuItemToMenuCategory: jest.fn(
    (id: number, dto: CreateMenuItemDto): Promise<MenuItem> =>
      Promise.resolve({
        id: 1,
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
        is_available: true, // Added
        menu_category: null, // Added
        menu_item_options: [], // Added
      }),
  ),
};

// Mock du guard d'authentification
class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('MenuCategoriesController', () => {
  let controller: MenuCategoriesController;
  let service: MenuCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuCategoriesController],
      providers: [
        {
          provide: MenuCategoriesService,
          useValue: mockMenuCategoriesService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<MenuCategoriesController>(MenuCategoriesController);
    service = module.get<MenuCategoriesService>(MenuCategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service create method and return the created category', () => {
      const createDto: CreateMenuCategoryDto = { name: 'New Category' };
      const result = controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ id: 1, name: 'New Category', created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method and return all categories', () => {
      const result = controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Category 1', created_at: expect.any(Date), updated_at: expect.any(Date) },
        { id: 2, name: 'Category 2', created_at: expect.any(Date), updated_at: expect.any(Date) },
      ]);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with the id and return the found category', () => {
      const result = controller.findOne('2');
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual({ id: 2, name: 'Category 2', created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated category', () => {
      const updateDto: UpdateMenuCategoryDto = { name: 'Updated Category' };
      const result = controller.update('3', updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: 3, name: 'Updated Category', created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id and return the result', () => {
      const result = controller.remove('4');
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual('Category with ID 4 deleted');
    });
  });

  describe('findItemsByCategories', () => {
    it('should call the service getMenuItemsByMenuCategoryId method and return the items', async () => {
      const result = await controller.findItemsByCategories('5');
      expect(service.getMenuItemsByMenuCategoryId).toHaveBeenCalledWith(5);
      expect(result).toEqual([
        {
          id: 1,
          name: 'Item 1 in Category 5',
          price: 10.99,
          description: 'Description 1',
          picture: 'base64_image_1',
          promotion: 0,
          isAvailable: true,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          is_available: true,
          menu_category: null,
          menu_item_options: [],
        },
      ]);
    });
  });

  describe('addItemToCategory', () => {
    it('should call the service addMenuItemToMenuCategory method and return the added item', async () => {
      const createItemDto: CreateMenuItemDto = {
        name: 'New Item',
        price: 12.50,
        description: 'New Item Description',
        picture: 'new_image',
        promotion: 5,
        isAvailable: true,
      };
      const result = await controller.addItemToCategory('6', createItemDto);
      expect(service.addMenuItemToMenuCategory).toHaveBeenCalledWith(6, createItemDto);
      expect(result).toEqual({ id: 1, ...createItemDto, created_at: expect.any(Date), updated_at: expect.any(Date), is_available: true, menu_category: null, menu_item_options: [] });
    });
  });
});

