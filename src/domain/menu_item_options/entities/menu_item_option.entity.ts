import { ApiProperty } from '@nestjs/swagger';
import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
import { MenuItemOptionValue } from 'src/domain/menu_item_option_values/entities/menu_item_option_value.entity';
import { MenuItem } from 'src/domain/menu_items/entities/menu_item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MenuItemOption {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  is_required: boolean;

  @Column()
  is_multiple_choice: boolean;

  @Column()
  position: number;

  @Column()
  menuItemId: number;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.menuItemOptions)
  @JoinColumn({ name: 'menuItemId' })
  menuItem: MenuItem;

  @OneToMany(() => MenuItemOptionValue, (value) => value.menuItemOption)
  menuItemOptionValues: MenuItemOptionValue[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
