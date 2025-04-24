import { ApiProperty } from '@nestjs/swagger';
import { MenuItemOption } from 'src/domain/menu_item_options/entities/menu_item_option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MenuItemOptionValue {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Coca Cola' })
  @Column()
  name: string;

  @ApiProperty({ example: 1.75 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  extra_price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => MenuItemOption,
    (menuItemOption) => menuItemOption.menuItemOptionValues,
  )
  menuItemOption: MenuItemOption;
}
