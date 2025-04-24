import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({ example: 'Menu burger' })
    @Column()
    name: string;

    @ApiProperty({ example: 10.50 })
    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    price : number;

    @ApiProperty({ example: 'Un délicieux burger avec frite et une boisson au choix.' })
    @Column()
    description: string;

    @ApiProperty({ example: 'iVBORw0KGgoAAAANSUhEUgAAAVIAAAF8CAYAAACdczOpAAAACXBIWXMAAAsSAAALEgHS3'})
    @Column()
    picture: string;

    @ApiProperty({ example: 10 })
    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    promotion : number;

    @ApiProperty({ example: true })
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
