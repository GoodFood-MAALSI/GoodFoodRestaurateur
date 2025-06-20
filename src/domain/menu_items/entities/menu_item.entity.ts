import { ApiProperty } from '@nestjs/swagger';
import { Images } from 'src/domain/images/entities/images.entity';
import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
import { MenuItemOption } from 'src/domain/menu_item_options/entities/menu_item_option.entity';
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
export class MenuItem {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  promotion: number;

  @Column()
  is_available: boolean;

  @Column()
  position: number;

  @Column()
  menuCategoryId: number;

  @ManyToOne(() => MenuCategory, (menuCategory) => menuCategory.menuItems)
  @JoinColumn({ name: 'menuCategoryId' })
  menuCategory: MenuCategory;

  @OneToMany(() => MenuItemOption, (option) => option.menuItem)
  menuItemOptions: MenuItemOption[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Images, image => image.menu_item) 
  images: Images[]; 
}
