import { ApiProperty } from '@nestjs/swagger';
import { Images } from 'src/domain/images/entities/images.entity';
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

    @ApiProperty({ example: 10 })
    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    promotion : number;

    @ApiProperty({ example: true })
    @Column()
    is_available : boolean;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => MenuCategory, menu_category => menu_category.menu_items)
    menu_category: MenuCategory;

    @OneToMany(() => MenuItemOption, (menu_item_option) => menu_item_option.menu_item)
    menu_item_options: MenuItemOption[];

    @OneToMany(() => Images, image => image.menu_item) // Le second argument doit être la propriété relationnelle dans Images
    images: Images[]; // La liste des images associées à ce MenuItem
  }
