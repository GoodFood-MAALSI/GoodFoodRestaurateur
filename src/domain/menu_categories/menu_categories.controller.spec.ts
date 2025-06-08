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
  create: jest.fn((dto: CreateMenuCategoryDto) => ({
    id: 1,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  update: jest.fn((id: number, dto: UpdateMenuCategoryDto) => ({
    id,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
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
        position: 1,
        isAvailable: true,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
        menuCategoryId: id,
        menuCategory: null,
        menuItemOptions: [],
      },
    ]),
  ),
  addMenuItemToMenuCategory: jest.fn(
    (id: number, dto: CreateMenuItemDto): Promise<MenuItem> =>
      Promise.resolve({
        id: 1,
        ...dto,
        position: 1,
        picture: '', // 🔧 Rendu obligatoire ici
        menuCategoryId: id,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date(),
        menuCategory: null,
        menuItemOptions: [],
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
      const createDto: CreateMenuCategoryDto = {
        name: 'New Category',
        position: 1,
        restaurantId: 42,
      };
      const result = controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        id: 1,
        name: 'New Category',
        position: 1,
        restaurantId: 42,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated category', () => {
      const updateDto: UpdateMenuCategoryDto = { name: 'Updated Category' };
      const result = controller.update(3, updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({
        id: 3,
        name: 'Updated Category',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id and return the result', () => {
      const result = controller.remove(4);
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual('Category with ID 4 deleted');
    });
  });
});
