import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionValuesController } from './menu_item_option_values.controller';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';

describe('MenuItemOptionValuesController', () => {
  let controller: MenuItemOptionValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemOptionValuesController],
      providers: [MenuItemOptionValuesService],
    }).compile();

    controller = module.get<MenuItemOptionValuesController>(MenuItemOptionValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
