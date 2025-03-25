import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemOptionValuesService } from './menu_item_option_values.service';

describe('MenuItemOptionValuesService', () => {
  let service: MenuItemOptionValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuItemOptionValuesService],
    }).compile();

    service = module.get<MenuItemOptionValuesService>(MenuItemOptionValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
