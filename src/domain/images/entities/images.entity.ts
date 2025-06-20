// src/restaurant/entities/image.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from 'src/domain/restaurant/entities/restaurant.entity'; // Assurez-vous que le chemin est correct
import { MenuItem } from 'src/domain/menu_items/entities/menu_item.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string; // Nom du fichier sur le système de stockage (ex: 'uuid.jpg')

  @Column()
  path: string; // Chemin ou URL complet de l'image (ex: '/uploads/images/uuid.jpg' ou 'https://s3.aws.com/bucket/uuid.jpg')

  @Column({ nullable: true })
  mimetype: string; // Type MIME (ex: 'image/jpeg')

  @Column({ nullable: true })
  size: number; // Taille du fichier en octets

  @Column({ default: false })
  isMain: boolean; // Si c'est l'image principale du restaurant

  // --- Polymorphic relation setup ---

  // Relation to Restaurant (nullable)
  @ManyToOne(() => Restaurant, restaurant => restaurant.images, {
    nullable: true, // This image might not belong to a restaurant
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ nullable: true }) // Make this column nullable
  restaurant_id: number;

  // Relation to MenuItem (nullable)
  @ManyToOne(() => MenuItem, menuItem => menuItem.images, {
    nullable: true, // This image might not belong to a menu item
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'menu_item_id' })
  menu_item: MenuItem;

  @Column({ nullable: true }) // Make this column nullable
  menu_item_id: number;

  // Type discriminator (optional but highly recommended for querying)
  @Column({ type: 'varchar', nullable: true }) // 'restaurant' or 'menu_item'
  entityType: string;
}