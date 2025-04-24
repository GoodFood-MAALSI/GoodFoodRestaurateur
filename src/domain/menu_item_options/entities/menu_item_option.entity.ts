
import { ApiProperty } from "@nestjs/swagger";
import { MenuItemOptionValue } from "src/domain/menu_item_option_values/entities/menu_item_option_value.entity";
import { MenuItem } from "src/domain/menu_items/entities/menu_item.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MenuItemOption {
        @ApiProperty({ example: '1' })
        @PrimaryGeneratedColumn()
        id: number;
      
        @ApiProperty({ example: 'choix de la boisson' })
        @Column()
        name: string;
    
        @ApiProperty({ example: 'True' })
        @Column()
        is_required : boolean;

        @ApiProperty({ example: 'True' })
        @Column()
        is_multiple_choice : boolean;
      
        @CreateDateColumn()
        createdAt: Date;
      
        @UpdateDateColumn()
        updatedAt: Date;

        @ManyToOne(() => MenuItem, menuItem => menuItem.menuItemOptions)
        menuItem: MenuItem;

        @OneToMany(() => MenuItemOptionValue, (menuItemOptionValue) => menuItemOptionValue.menuItemOption)
        menuItemOptionValues: MenuItemOptionValue[];

}
