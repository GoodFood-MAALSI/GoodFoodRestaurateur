import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column()
    description : string;

    @Column()
    street_number :string;

    @Column()
    street : string;

    @Column()
    city : string;

    @Column()
    postal_code : string;

    @Column()
    country : string;

    @Column({ unique: true })
    email: string;
  
    @Column({ unique: true })
    phone_number: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }