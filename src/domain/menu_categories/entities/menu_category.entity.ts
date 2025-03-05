import { MenuItem } from "src/domain/menu_items/entities/menu_item.entity";
import { Restaurant } from "src/domain/restaurant/entities/restaurant.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MenuCategory {
        @PrimaryGeneratedColumn()
        id: number;
      
        @Column()
        name: string;
      
        @CreateDateColumn()
        createdAt: Date;
      
        @UpdateDateColumn()
        updatedAt: Date;

        @ManyToOne(() => Restaurant, restaurant => restaurant.menuCategories)
        restaurant: Restaurant;

        @OneToMany(() => MenuItem, (menuItem) => menuItem.menuCategory)
        menuItems: MenuItem[];
}
