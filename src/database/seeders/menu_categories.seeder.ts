import { MenuCategory } from '../../domain/menu_categories/entities/menu_category.entity';
import { Restaurant } from '../../domain/restaurant/entities/restaurant.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class MenuCategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(MenuCategory);
    const restaurantRepo = dataSource.getRepository(Restaurant);

    // Vérifiez si des restaurants existent
    const restaurantCount = await restaurantRepo.count();
    if (restaurantCount === 0) {
      return;
    }

    const menuCategories = [
      // La Chicorée (Brasserie, ID 1)
      { id: 1, name: 'Entrées', restaurantId: 1, position: 1 },
      { id: 2, name: 'Plats', restaurantId: 1, position: 2 },
      { id: 3, name: 'Desserts', restaurantId: 1, position: 3 },

      // Le Barbier qui Fume (Bistrot, ID 2)
      { id: 4, name: 'Entrées du Nord', restaurantId: 2, position: 1 },
      { id: 5, name: 'Viandes Fumées', restaurantId: 2, position: 2 },
      { id: 6, name: 'Accompagnements', restaurantId: 2, position: 3 },

      // L’Gaiette (Estaminet, ID 3)
      { id: 7, name: 'Spécialités Régionales', restaurantId: 3, position: 1 },
      { id: 8, name: 'Plats Traditionnels', restaurantId: 3, position: 2 },
      { id: 9, name: 'Desserts du Nord', restaurantId: 3, position: 3 },

      // Le Compostelle (Gastronomique, ID 4)
      { id: 10, name: 'Amuse-Bouches', restaurantId: 4, position: 1 },
      { id: 11, name: 'Plats Principaux', restaurantId: 4, position: 2 },
      { id: 12, name: 'Desserts Raffinés', restaurantId: 4, position: 3 },

      // N’Autre Monde (Bistrot, ID 5)
      { id: 13, name: 'Entrées Créatives', restaurantId: 5, position: 1 },
      { id: 14, name: 'Plats Signature', restaurantId: 5, position: 2 },
      { id: 15, name: 'Desserts Originaux', restaurantId: 5, position: 3 },

      // Au Vieux de la Vieille (Estaminet, ID 6)
      { id: 16, name: 'Entrées Régionales', restaurantId: 6, position: 1 },
      { id: 17, name: 'Plats du Terroir', restaurantId: 6, position: 2 },
      { id: 18, name: 'Douceurs Locales', restaurantId: 6, position: 3 },

      // La Table du Clarance (Gastronomique, ID 7)
      { id: 19, name: 'Menu Dégustation', restaurantId: 7, position: 1 },
      { id: 20, name: 'Plats de Saison', restaurantId: 7, position: 2 },
      { id: 21, name: 'Desserts d’Exception', restaurantId: 7, position: 3 },

      // Le Barbue d’Anvers (Estaminet, ID 8)
      { id: 22, name: 'Entrées Ch’ti', restaurantId: 8, position: 1 },
      { id: 23, name: 'Plats Chaleureux', restaurantId: 8, position: 2 },
      { id: 24, name: 'Desserts Traditionnels', restaurantId: 8, position: 3 },

      // Jour de Pêche (Fruits de Mer, ID 9)
      { id: 25, name: 'Plateaux de Fruits de Mer', restaurantId: 9, position: 1 },
      { id: 26, name: 'Poissons et Crustacés', restaurantId: 9, position: 2 },
      { id: 27, name: 'Entrées Marines', restaurantId: 9, position: 3 },

      // L’Arc (Bistrot, ID 10)
      { id: 28, name: 'Entrées Modernes', restaurantId: 10, position: 1 },
      { id: 29, name: 'Plats Contemporains', restaurantId: 10, position: 2 },
      { id: 30, name: 'Desserts Élégants', restaurantId: 10, position: 3 },
    ];

    for (const categoryData of menuCategories) {
      const menuCategory = new MenuCategory();
      menuCategory.id = categoryData.id;
      menuCategory.name = categoryData.name;
      menuCategory.restaurantId = categoryData.restaurantId;
      menuCategory.position = categoryData.position;

      await repo.save(menuCategory, { data: { id: categoryData.id } });
      console.log(`Menu category ${menuCategory.name} (ID: ${menuCategory.id}) upserted successfully!`);
    }

    console.log('All menu categories inserted or updated successfully!');
  }
}
