import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
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
  }