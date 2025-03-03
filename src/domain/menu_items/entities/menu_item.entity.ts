import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    price : number;

    @Column()
    description: string;

    @Column()
    picture: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    promotion : number;

    @Column()
    isAvailable : boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
