import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class RestaurantType {
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn()
    id: number;
  
    @ApiProperty({ example: 'Italien' })
    @Column()
    name: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Restaurant, (restaurant) => restaurant.restaurant_type)
    restaurants: Restaurant[];
  }