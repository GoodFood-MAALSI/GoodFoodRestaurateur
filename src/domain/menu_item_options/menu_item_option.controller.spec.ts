import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionsController } from './menu_item_options.controller';
import { MenuItemOptionsService } from './menu_item_options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockMenuItemOptionsService = {
  create: jest.fn(async (dto: CreateMenuItemOptionDto) => ({
    id: 1,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  update: jest.fn(async (id: number, dto: UpdateMenuItemOptionDto) => ({
    id,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  remove: jest.fn(async (id: number) => Promise.resolve()),
};

// Mock du guard
class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('MenuItemOptionsController', () => {
  let controller: MenuItemOptionsController;
  let service: MenuItemOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemOptionsController],
      providers: [
        {
          provide: MenuItemOptionsService,
          useValue: mockMenuItemOptionsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<MenuItemOptionsController>(MenuItemOptionsController);
    service = module.get<MenuItemOptionsService>(MenuItemOptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created item', async () => {
      const dto: CreateMenuItemOptionDto = {
        name: 'Option A',
        is_required: true,
        is_multiple_choice: false,
        position: 1,
        menuItemId: 10,
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
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
    it('should call service.update with id and dto and return updated item', async () => {
      const updateDto: UpdateMenuItemOptionDto = {
        name: 'Updated name',
        position: 2,
      };
      const result = await controller.update(5, updateDto);
      expect(service.update).toHaveBeenCalledWith(5, updateDto);
      expect(result).toEqual(expect.objectContaining({
        id: 5,
        name: 'Updated name',
        position: 2,
      }));
    });
  });

  describe('remove', () => {
    it('should call service.remove with id and return void', async () => {
      const result = await controller.remove(3);
      expect(service.remove).toHaveBeenCalledWith(3);
      expect(result).toBeUndefined();
    });
  });
});
