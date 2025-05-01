import { ApiProperty } from "@nestjs/swagger";
import { MenuItem } from "src/domain/menu_items/entities/menu_item.entity";
import { Restaurant } from "src/domain/restaurant/entities/restaurant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MenuCategory {
        @ApiProperty({ example: '1' })
        @PrimaryGeneratedColumn()
        id: number;
      
        @ApiProperty({ example: 'Menus' })
        @Column()
        name: string;
      
        @CreateDateColumn()
        created_at: Date;
      
        @UpdateDateColumn()
        updated_at: Date;

        @ManyToOne(() => Restaurant, restaurant => restaurant.menu_categories)
        restaurant: Restaurant;

        @OneToMany(() => MenuItem, (menu_item) => menu_item.menu_category)
        menu_items: MenuItem[];
}
