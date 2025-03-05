import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
import { MenuItemOption } from 'src/domain/menu_item_options/entities/menu_item_option.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    price : number;

    @Column()
    description: string;

    @Column()
    picture: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    promotion : number;

    @Column()
    isAvailable : boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => MenuCategory, menuCategory => menuCategory.menuItems)
    menuCategory: MenuCategory;

    @OneToMany(() => MenuItemOption, (menuItemOption) => menuItemOption.menuItem)
    menuItemOptions: MenuItemOption[];
  }
