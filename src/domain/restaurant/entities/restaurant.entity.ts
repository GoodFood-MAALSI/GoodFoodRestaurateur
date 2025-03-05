import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
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
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column()
    description : string;

    @Column()
    street_number :string;

    @Column()
    street : string;

    @Column()
    city : string;

    @Column()
    postal_code : string;

    @Column()
    country : string;

    @Column({ unique: true })
    email: string;
  
    @Column({ unique: true })
    phone_number: number;

    @Column()
    is_open : boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => MenuCategory, (menuCategory) => menuCategory.restaurant)
    menuCategories: MenuCategory[];
  }