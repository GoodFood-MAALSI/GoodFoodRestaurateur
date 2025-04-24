import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
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
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 33612345678 })
  @Column({ unique: true })
  phone_number: number;

  @ApiProperty({ example: true })
  @Column()
  is_open: boolean;

  @ApiProperty() 
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
  
    @OneToMany(() => MenuCategory, (menuCategory) => menuCategory.restaurant)
    menuCategories: MenuCategory[];
  }