import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionValuesController } from './menu_item_option_values.controller';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockMenuItemOptionValuesService = {
  create: jest.fn((dto: CreateMenuItemOptionValueDto) => Promise.resolve({ id: 1, ...dto })),
  update: jest.fn((id: number, dto: UpdateMenuItemOptionValueDto) => Promise.resolve({ id, ...dto })),
  remove: jest.fn((id: number) => Promise.resolve()),
};

// Mock du guard d'authentification
class AuthGuardMock {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('MenuItemOptionValuesController', () => {
  let controller: MenuItemOptionValuesController;
  let service: MenuItemOptionValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemOptionValuesController],
      providers: [
        {
          provide: MenuItemOptionValuesService,
          useValue: mockMenuItemOptionValuesService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useClass(AuthGuardMock)
      .compile();

    controller = module.get<MenuItemOptionValuesController>(MenuItemOptionValuesController);
    service = module.get<MenuItemOptionValuesService>(MenuItemOptionValuesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service create method and return the created value', async () => {
      const createDto: CreateMenuItemOptionValueDto = {
        name: 'New Option',
        extra_price: 2.5,
        position: 1,
        menuItemOptionId: 5,
      };
      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ id: 1, ...createDto });
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated value', async () => {
      const updateDto: UpdateMenuItemOptionValueDto = {
        name: 'Updated Option',
        extra_price: 3.0,
        position: 2,
      };
      const result = await controller.update(3, updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: 3, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id', async () => {
      await controller.remove(4);
      expect(service.remove).toHaveBeenCalledWith(4);
    });
  });
});
