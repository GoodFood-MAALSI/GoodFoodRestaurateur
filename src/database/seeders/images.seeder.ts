import { Images } from 'src/domain/images/entities/images.entity';
import { Restaurant } from '../../domain/restaurant/entities/restaurant.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class ImagesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Images);
    const restaurantRepo = dataSource.getRepository(Restaurant);

    // Vérifiez si des restaurants existent
    const restaurantCount = await restaurantRepo.count();
    if (restaurantCount === 0) {
      return;
    }

    const images = [
      // La Chicorée (Brasserie, ID 1)
      {
        id: 1,
        filename: 'image-restaurant-1.jpg',
        path: '/uploads/images/default/image-restaurant-1.jpg',
        mimetype: 'image/jpeg',
        size: 240624,
        isMain: true,
        restaurant_id: 1,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // Le Barbier qui Fume (Bistrot, ID 2)
      {
        id: 2,
        filename: 'image-restaurant-2.jpg',
        path: '/uploads/images/default/image-restaurant-2.jpg',
        mimetype: 'image/jpeg',
        size: 8288340,
        isMain: true,
        restaurant_id: 2,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // L’Gaiette (Estaminet, ID 3)
      {
        id: 3,
        filename: 'image-restaurant-3.jpg',
        path: '/uploads/images/default/image-restaurant-3.jpg',
        mimetype: 'image/jpeg',
        size: 916668,
        isMain: true,
        restaurant_id: 3,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // Le Compostelle (Gastronomique, ID 4)
      {
        id: 4,
        filename: 'image-restaurant-4.jpg',
        path: '/uploads/images/default/image-restaurant-4.jpg',
        mimetype: 'image/jpeg',
        size: 1369641,
        isMain: true,
        restaurant_id: 4,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // N’Autre Monde (Bistrot, ID 5)
      {
        id: 5,
        filename: 'image-restaurant-5.jpg',
        path: '/uploads/images/default/image-restaurant-5.jpg',
        mimetype: 'image/jpeg',
        size: 117936,
        isMain: true,
        restaurant_id: 5,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // Au Vieux de la Vieille (Estaminet, ID 6)
      {
        id: 6,
        filename: 'image-restaurant-6.jpg',
        path: '/uploads/images/default/image-restaurant-6.jpg',
        mimetype: 'image/jpeg',
        size: 2214908,
        isMain: true,
        restaurant_id: 6,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // La Table du Clarance (Gastronomique, ID 7)
      {
        id: 7,
        filename: 'image-restaurant-7.jpg',
        path: '/uploads/images/default/image-restaurant-7.jpg',
        mimetype: 'image/jpeg',
        size: 3714462,
        isMain: true,
        restaurant_id: 7,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // Le Barbue d’Anvers (Estaminet, ID 8)
      {
        id: 8,
        filename: 'image-restaurant-8.jpg',
        path: '/uploads/images/default/image-restaurant-8.jpg',
        mimetype: 'image/jpeg',
        size: 1531767,
        isMain: true,
        restaurant_id: 8,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // Jour de Pêche (Fruits de Mer, ID 9)
      {
        id: 9,
        filename: 'image-restaurant-9.jpg',
        path: '/uploads/images/default/image-restaurant-9.jpg',
        mimetype: 'image/jpeg',
        size: 1963542,
        isMain: true,
        restaurant_id: 9,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      // L’Arc (Bistrot, ID 10)
      {
        id: 10,
        filename: 'image-restaurant-10.jpg',
        path: '/uploads/images/default/image-restaurant-10.jpg',
        mimetype: 'image/jpeg',
        size: 4003310,
        isMain: true,
        restaurant_id: 10,
        menu_item_id: null,
        entityType: 'restaurant',
      },
    ];

    for (const imageData of images) {
      const image = new Images();
      image.id = imageData.id;
      image.filename = imageData.filename;
      image.path = imageData.path;
      image.mimetype = imageData.mimetype;
      image.size = imageData.size;
      image.isMain = imageData.isMain;
      image.restaurant_id = imageData.restaurant_id;
      image.menu_item_id = imageData.menu_item_id;
      image.entityType = imageData.entityType;

      await repo.save(image, { data: { id: imageData.id } });
      console.log(`Image (ID: ${image.id}) upserted successfully!`);
    }

    console.log('All images inserted or updated successfully!');
  }
}
