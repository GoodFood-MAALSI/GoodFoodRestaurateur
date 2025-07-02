import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum ReviewStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

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

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.ACTIVE,
  })
  status: ReviewStatus;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}