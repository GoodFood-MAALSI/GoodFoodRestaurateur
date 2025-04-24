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
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }