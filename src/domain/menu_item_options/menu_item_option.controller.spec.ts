import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionsController } from './menu_item_options.controller';
import { MenuItemOptionsService } from './menu_item_options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu_item_option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu_item_option.dto';
import { CreateMenuItemOptionValueDto } from '../menu_item_option_values/dto/create-menu_item_option_value.dto';
import { MenuItemOptionValue } from '../menu_item_option_values/entities/menu_item_option_value.entity';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock du service
const mockMenuItemOptionsService = {
  create: jest.fn((dto: CreateMenuItemOptionDto) => ({
    id: 1,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  findAll: jest.fn(() => [
    { id: 1, name: 'Option 1', is_required: true, is_multiple_choice: false, created_at: new Date(), updated_at: new Date() },
    { id: 2, name: 'Option 2', is_required: false, is_multiple_choice: true, created_at: new Date(), updated_at: new Date() },
  ]),
  findOne: jest.fn((id: number) => ({
    id: id,
    name: `Option ${id}`,
    is_required: true,
    is_multiple_choice: false,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  update: jest.fn((id: number, dto: UpdateMenuItemOptionDto) => ({
    id: id,
    ...dto,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  remove: jest.fn((id: number) => `Option with ID ${id} deleted`),
  getMenuOptionValuessByMenuOptionId: jest.fn((id: number): Promise<MenuItemOptionValue[]> =>
    Promise.resolve([
      {
        id: 1,
        name: `Value for Option ${id}`,
        extra_price: 1.0,
        created_at: new Date(),
        updated_at: new Date(),
        menu_item_option: {
          id: id,
          name: `Option ${id}`,
          is_required: true,
          is_multiple_choice: false,
          created_at: new Date(),
          updated_at: new Date(),
          menu_item: null, // Added null
          menu_item_option_values: [], // Added empty array
        },
      },
    ]),
  ),
  addMenuItemOptionValueToMenuItemOption: jest.fn(
    (id: number, dto: CreateMenuItemOptionValueDto): Promise<MenuItemOptionValue> =>
      Promise.resolve({
        id: 1,
        name: dto.name,
        extra_price: dto.extra_price,
        created_at: new Date(),
        updated_at: new Date(),
        menu_item_option: {
          id: id,
          name: `Option ${id}`,
          is_required: true,
          is_multiple_choice: false,
          created_at: new Date(),
          updated_at: new Date(),
          menu_item: null,  // Added null
          menu_item_option_values: [], //added empty array
        } as any,
      }),
  ),
};

// Mock du guard d'authentification
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
    it('should call the service create method and return the created option', () => {
      const createDto: CreateMenuItemOptionDto = { name: 'New Option', is_required: true, is_multiple_choice: false };
      const result = controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        id: 1,
        name: 'New Option',
        is_required: true,
        is_multiple_choice: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should call the service findAll method and return all options', () => {
      const result = controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, name: 'Option 1', is_required: true, is_multiple_choice: false, created_at: expect.any(Date), updated_at: expect.any(Date) },
        { id: 2, name: 'Option 2', is_required: false, is_multiple_choice: true, created_at: expect.any(Date), updated_at: expect.any(Date) },
      ]);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with the id and return the found option', () => {
      const result = controller.findOne('2');
      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual({
        id: 2,
        name: 'Option 2',
        is_required: true,
        is_multiple_choice: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('update', () => {
    it('should call the service update method with the id and dto, and return the updated option', () => {
      const updateDto: UpdateMenuItemOptionDto = { name: 'Updated Option' };
      const result = controller.update('3', updateDto);
      expect(service.update).toHaveBeenCalledWith(3, updateDto);
      expect(result).toEqual({ id: 3, name: 'Updated Option', created_at: expect.any(Date), updated_at: expect.any(Date) });
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the id and return the result', () => {
      const result = controller.remove('4');
      expect(service.remove).toHaveBeenCalledWith(4);
      expect(result).toEqual('Option with ID 4 deleted');
    });
  });

  describe('findOptionValuesByOptions', () => {
    it('should call the service getMenuOptionValuessByMenuOptionId method and return the option values', async () => {
      const result = await controller.findOptionValuesByOptions('5');
      expect(service.getMenuOptionValuessByMenuOptionId).toHaveBeenCalledWith(5);
      expect(result).toEqual([{ id: 1, name: 'Value for Option 5', extra_price: 1.0, created_at: expect.any(Date), updated_at: expect.any(Date), menu_item_option: { id: 5, name: 'Option 5', is_required: true, is_multiple_choice: false, created_at: expect.any(Date), updated_at: expect.any(Date), menu_item: null, menu_item_option_values: [] } }]);
    });
  });

  describe('addValueToOption', () => {
    it('should call the service addMenuItemOptionValueToMenuItemOption method and return the added value', async () => {
      const createValueDto: CreateMenuItemOptionValueDto = { name: 'New Value', extra_price: 2.5 };
      const result = await controller.addValueToOption('6', createValueDto);
      expect(service.addMenuItemOptionValueToMenuItemOption).toHaveBeenCalledWith(6, createValueDto);
      expect(result).toEqual({ id: 1, name: 'New Value', extra_price: 2.5, created_at: expect.any(Date), updated_at: expect.any(Date), menu_item_option: { id: 6, name: 'Option 6', is_required: true, is_multiple_choice: false, created_at: expect.any(Date), updated_at: expect.any(Date), menu_item: null, menu_item_option_values: [] } as any });
    });
  });
});

