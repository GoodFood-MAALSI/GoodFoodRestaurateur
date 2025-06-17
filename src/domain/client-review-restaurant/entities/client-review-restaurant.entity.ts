import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { User } from 'src/domain/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ClientReviewRestaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  review: string;

  @Column()
  rating: number;

  @Column()
  clientId: number;

  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}