import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { MenuItem } from 'src/domain/menu_items/entities/menu_item.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string; 

  @Column()
  path: string; 

  @Column({ nullable: true })
  mimetype: string; 

  @Column({ nullable: true })
  size: number; 

  @Column({ default: false })
  isMain: boolean; 

  @ManyToOne(() => Restaurant, restaurant => restaurant.images, {
    nullable: true, 
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Column({ nullable: true }) 
  restaurant_id: number;


  @ManyToOne(() => MenuItem, menuItem => menuItem.images, {
    nullable: true, 
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'menuItemId' })
  menu_item: MenuItem;

  @Column({ nullable: true }) 
  menu_item_id: number;

  @Column({ type: 'varchar', nullable: true }) 
  entityType: string;
}