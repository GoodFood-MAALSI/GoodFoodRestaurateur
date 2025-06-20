import { ApiProperty } from '@nestjs/swagger';
import { MenuItemOption } from 'src/domain/menu_item_options/entities/menu_item_option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MenuItemOptionValue {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  extra_price: number;

  @Column()
  position: number;

  @Column()
  menuItemOptionId: number;

  @ManyToOne(() => MenuItemOption, (option) => option.menuItemOptionValues)
  @JoinColumn({ name: 'menuItemOptionId' })
  menuItemOption: MenuItemOption;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
