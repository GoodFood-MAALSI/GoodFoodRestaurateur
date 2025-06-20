import { ApiProperty } from '@nestjs/swagger';
import { MenuItem } from 'src/domain/menu_items/entities/menu_item.entity';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
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
export class MenuCategory {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Menus' })
  @Column()
  name: string;

  @ApiProperty({ example: 1, description: 'Position (ordre) de la catégorie dans la liste' })
  @Column()
  position: number;

  @ApiProperty()
  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuCategories)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.menuCategory)
  menuItems: MenuItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
