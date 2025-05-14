import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionValuesController } from './menu_item_option_values.controller';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';
import { CreateMenuItemOptionValueDto } from './dto/create-menu_item_option_value.dto';
import { UpdateMenuItemOptionValueDto } from './dto/update-menu_item_option_value.dto';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockMenuItemOptionValuesService = {
  create: jest.fn((dto: CreateMenuItemOptionValueDto) => ({ id: '1', ...dto })),
  findAll: jest.fn(() => [
    { id: '1', name: 'Option 1', extra_price: 1.5 },
    { id: '2', name: 'Option 2', extra_price: 2.0 },
  ]),
  findOne: jest.fn((id: number) => ({ id: id.toString(), name: `Option ${id}`, extra_price: id * 0.5 })),
  update: jest.fn((id: number, dto: UpdateMenuItemOptionValueDto) => ({ id: id.toString(), ...dto })),
  remove: jest.fn((id: number) => `Option with ID ${id} deleted`),
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
    it('should call the service create method and return the created value', () => {
      const createDto: CreateMenuItemOptionValueDto = { name: 'New Option', extra_price: 2.5 };
      const result = controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ id: '1', name: 'New Option', extra_price: 2.5 });
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method and return all values', () => {
      const result = controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: '1', name: 'Option 1', extra_price: 1.5 },
        { id: '2', name: 'Option 2', extra_price: 2.0 },
      ]);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with the id and return the found value', () => {
      const result = controller.findOne('2');
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual({ id: '2', name: 'Option 2', extra_price: 1 }); // Adjusted extra_price for test
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated value', () => {
      const updateDto: UpdateMenuItemOptionValueDto = { name: 'Updated Option', extra_price: 3.0 };
      const result = controller.update('3', updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: '3', name: 'Updated Option', extra_price: 3.0 });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id and return the result', () => {
      const result = controller.remove('4');
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual('Option with ID 4 deleted');
    });
  });
});

