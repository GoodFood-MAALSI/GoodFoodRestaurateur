import { ApiProperty } from '@nestjs/swagger';
import { MenuCategory } from 'src/domain/menu_categories/entities/menu_category.entity';
import { RestaurantType } from 'src/domain/restaurant_type/entities/restaurant_type.entity';
import { User } from 'src/domain/users/entities/user.entity';
import { ClientReviewRestaurant } from 'src/domain/client-review-restaurant/entities/client-review-restaurant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Images } from 'src/domain/images/entities/images.entity';

@Entity()
export class Restaurant {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Le Bon Burger' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Un restaurant de burgers gourmets avec des ingrédients frais.',
  })
  @Column()
  description: string;

  @ApiProperty({ example: '12' })
  @Column()
  street_number: string;

  @ApiProperty({ example: 'Rue des Gourmands' })
  @Column()
  street: string;

  @ApiProperty({ example: 'Wavrin' })
  @Column()
  city: string;

  @ApiProperty({ example: '59136' })
  @Column()
  postal_code: string;

  @ApiProperty({ example: 'France' })
  @Column()
  country: string;

  @ApiProperty({ example: 'lebonburger@email.com' })
  @Column()
  email: string;

  @ApiProperty({ example: '33612345678' })
  @Column()
  phone_number: string;

  @ApiProperty({ example: '63201210000012' })
  @Column({ unique: true })
  siret: string;

  @ApiProperty({ example: true })
  @Column()
  is_open: boolean;

  @ApiProperty({ example: 16.0 })
  @Column({ type: 'decimal', precision: 15, scale: 8, default: 0 })
  long: number;

  @ApiProperty({ example: 16.0 })
  @Column({ type: 'decimal', precision: 15, scale: 8, default: 0 })
  lat: number;

  @Column()
  restaurantTypeId: number;

  @Column()
  userId: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => RestaurantType)
  @JoinColumn({ name: 'restaurantTypeId' })
  restaurantType: RestaurantType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => MenuCategory, (menuCategory) => menuCategory.restaurant)
  menuCategories: MenuCategory[];

  @OneToMany(() => ClientReviewRestaurant, (review) => review.restaurant)
  reviews: ClientReviewRestaurant[];

  @ApiProperty({ example: 10, description: 'Nombre total d\'avis' })
  review_count?: number;

  @ApiProperty({ example: 4.5, description: 'Note moyenne sur 5' })
  average_rating?: number;

  @OneToMany(() => Images, image => image.restaurant, {
    cascade: ['insert', 'update'],
    eager: true,
    onDelete: 'CASCADE', 
  })
  images: Images[];
}