import { MenuItem } from "src/domain/menu_items/entities/menu_item.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MenuItemOption {
        @PrimaryGeneratedColumn()
        id: number;
      
        @Column()
        name: string;
    
        @Column()
        is_required : boolean;

        @Column()
        is_multiple_choice : boolean;
      
        @CreateDateColumn()
        createdAt: Date;
      
        @UpdateDateColumn()
        updatedAt: Date;

        @ManyToOne(() => MenuItem, menuItem => menuItem.menuItemOptions)
        menuItem: MenuItem;

}
