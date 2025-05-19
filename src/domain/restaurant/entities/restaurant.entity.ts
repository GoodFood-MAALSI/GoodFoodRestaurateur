import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { RestaurantType } from 'src/domain/restaurant_type/entities/restaurant_type.entity';
import { User } from 'src/domain/users/entities/user.entity';
  
  @Entity()
  export class Restaurant {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Le Bon Burger' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Un restaurant de burgers gourmets avec des ingrédients frais.' })
  @Column()
  description: string;

  @ApiProperty({ example: '12' })
  @Column()
  street_number: string;

  @ApiProperty({ example: 'Rue des Gourmands' })
  @Column()
  street: string;

  @ApiProperty({ example: 'Wavrin' })
  @Column()
  city: string;

  @ApiProperty({ example: '59136' })
  @Column()
  postal_code: string;

  @ApiProperty({ example: 'France' })
  @Column()
  country: string;

  @ApiProperty({ example: 'lebonburger@email.com' })
  email: string;

  @ApiProperty({ example: '33612345678' })
  phone_number: string;

  @ApiProperty({ example: '63201210000012' })
  @Column({ unique: true })
  siret: string;

  @ApiProperty({ example: true })
  @Column()
  is_open: boolean;

  @ApiProperty() 
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
  
  @OneToMany(() => MenuCategory, (menu_category) => menu_category.restaurant)
  menu_categories: MenuCategory[];

  @ManyToOne(() => RestaurantType, (restaurant_type) => restaurant_type.restaurants)
  restaurant_type: RestaurantType;

  @ManyToOne(() => User, (user) => user.restaurants)
  user: User;
  }