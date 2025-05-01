
import { ApiProperty } from "@nestjs/swagger";
import { MenuItemOptionValue } from "src/domain/menu_item_option_values/entities/menu_item_option_value.entity";
import { MenuItem } from "src/domain/menu_items/entities/menu_item.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MenuItemOption {
        @ApiProperty({ example: 1 })
        @PrimaryGeneratedColumn()
        id: number;
      
        @ApiProperty({ example: 'choix de la boisson' })
        @Column()
        name: string;
    
        @ApiProperty({ example: true })
        @Column()
        is_required : boolean;

        @ApiProperty({ example: true })
        @Column()
        is_multiple_choice : boolean;
      
        @CreateDateColumn()
        created_at: Date;
      
        @UpdateDateColumn()
        updated_at: Date;

        @ManyToOne(() => MenuItem, menu_item => menu_item.menu_item_options)
        menu_item: MenuItem;

        @OneToMany(() => MenuItemOptionValue, (menu_item_option_value) => menu_item_option_value.menu_item_option)
        menu_item_option_values: MenuItemOptionValue[];

}
