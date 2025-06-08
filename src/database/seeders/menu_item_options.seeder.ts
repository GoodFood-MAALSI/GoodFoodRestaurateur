import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { MenuItemOption } from '../../domain/menu_item_options/entities/menu_item_option.entity';
import { MenuItem } from '../../domain/menu_items/entities/menu_item.entity';

export class MenuItemOptionSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(MenuItemOption);
    const menuItemRepo = dataSource.getRepository(MenuItem);

    // Vérifiez si des menu items existent
    const menuItemCount = await menuItemRepo.count();
    if (menuItemCount === 0) {
      console.log('Aucun menu item trouvé. Veuillez exécuter le seeder MenuItem d’abord.');
      return;
    }

    const menuItemOptions = [
      // Restaurant 1: La Chicorée (Brasserie)
      // Menu Salade Ch’ti (ID 1)
      { id: 1, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 1, position: 1},
      { id: 2, name: 'Choix du Pain', is_required: false, is_multiple_choice: false, menuItemId: 1, position: 2},
      // Menu Carbonnade (ID 4)
      { id: 3, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 4, position: 1},
      { id: 4, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 4, position: 2},
      // Menu Welsh (ID 5)
      { id: 5, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 5, position: 1},
      { id: 6, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 5, position: 2},
      // Menu Gaufre (ID 9)
      { id: 7, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 9, position: 1},
      { id: 8, name: 'Choix de la Garniture', is_required: false, is_multiple_choice: true, menuItemId: 9, position: 2},

      // Restaurant 2: Le Barbier qui Fume (Bistrot)
      // Menu Rillettes (ID 10)
      { id: 9, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 10, position: 1},
      { id: 10, name: 'Choix du Pain', is_required: false, is_multiple_choice: false, menuItemId: 10, position: 2},
      // Menu Côte de Porc (ID 13)
      { id: 11, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 13, position: 1},
      { id: 12, name: 'Choix de la Sauce', is_required: false, is_multiple_choice: true, menuItemId: 13, position: 2},
      // Menu Saucisse (ID 14)
      { id: 13, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 14, position: 1},
      { id: 14, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 14, position: 2},

      // Restaurant 3: L’Gaiette (Estaminet)
      // Menu Potjevleesch (ID 19)
      { id: 15, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 19, position: 1},
      { id: 16, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 19, position: 2},
      // Menu Carbonnade (ID 22)
      { id: 17, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 22, position: 1},
      { id: 18, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 22, position: 2},
      // Menu Welsh (ID 23)
      { id: 19, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 23, position: 1},
      { id: 20, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 23, position: 2},
      // Menu Café Gourmand (ID 27)
      { id: 21, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 27, position: 1},
      { id: 22, name: 'Choix du Mini-Dessert', is_required: false, is_multiple_choice: true, menuItemId: 27, position: 2},

      // Restaurant 4: Le Compostelle (Gastronomique)
      // Menu Amuse-Bouche (ID 30)
      { id: 23, name: 'Choix du Vin', is_required: false, is_multiple_choice: false, menuItemId: 30, position: 1},
      { id: 24, name: 'Choix de l’Amuse-Bouche', is_required: true, is_multiple_choice: false, menuItemId: 30, position: 2},
      // Menu Filet Mignon (ID 31)
      { id: 25, name: 'Choix du Vin', is_required: false, is_multiple_choice: false, menuItemId: 31, position: 1},
      { id: 26, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 31, position: 2},
      // Menu Dessert (ID 36)
      { id: 27, name: 'Choix du Vin', is_required: false, is_multiple_choice: false, menuItemId: 36, position: 1},
      { id: 28, name: 'Choix du Dessert', is_required: true, is_multiple_choice: false, menuItemId: 36, position: 2},

      // Restaurant 5: N’Autre Monde (Bistrot)
      // Menu Carpaccio (ID 37)
      { id: 29, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 37, position: 1},
      { id: 30, name: 'Choix du Pain', is_required: false, is_multiple_choice: false, menuItemId: 37, position: 2},
      // Menu Magret (ID 40)
      { id: 31, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 40, position: 1},
      { id: 32, name: 'Choix de la Sauce', is_required: false, is_multiple_choice: true, menuItemId: 40, position: 2},
      // Menu Dessert (ID 45)
      { id: 33, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 45, position: 1},
      { id: 34, name: 'Choix du Dessert', is_required: false, is_multiple_choice: false, menuItemId: 45, position: 2},

      // Restaurant 6: Au Vieux de la Vieille (Estaminet)
      // Menu Maroilles (ID 46)
      { id: 35, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 46, position: 1},
      { id: 36, name: 'Choix du Pain', is_required: false, is_multiple_choice: false, menuItemId: 46, position: 2},
      // Menu Potjevleesch (ID 49)
      { id: 37, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 49, position: 1},
      { id: 38, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 49, position: 2},
      // Menu Carbonnade (ID 50)
      { id: 39, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 50, position: 1},
      { id: 40, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 50, position: 2},
      // Menu Café Gourmand (ID 54)
      { id: 41, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 54, position: 1},
      { id: 42, name: 'Choix du Mini-Dessert', is_required: false, is_multiple_choice: true, menuItemId: 54, position: 2},

      // Restaurant 7: La Table du Clarance (Gastronomique)
      // Menu Entrée (ID 55)
      { id: 43, name: 'Choix du Vin', is_required: false, is_multiple_choice: false, menuItemId: 55, position: 1},
      { id: 44, name: 'Choix de l’Entrée', is_required: true, is_multiple_choice: false, menuItemId: 55, position: 2},
      // Menu Dégustation (ID 58)
      { id: 45, name: 'Choix du Vin', is_required: false, is_multiple_choice: false, menuItemId: 58, position: 1},
      { id: 46, name: 'Choix du Plat', is_required: true, is_multiple_choice: false, menuItemId: 58, position: 2},
      // Menu Dessert (ID 63)
      { id: 47, name: 'Choix du Vin', is_required: false, is_multiple_choice: false, menuItemId: 63, position: 1},
      { id: 48, name: 'Choix du Dessert', is_required: true, is_multiple_choice: false, menuItemId: 63, position: 2},

      // Restaurant 8: Le Barbue d’Anvers (Estaminet)
      // Menu Terrine (ID 64)
      { id: 49, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 64, position: 1},
      { id: 50, name: 'Choix du Pain', is_required: false, is_multiple_choice: false, menuItemId: 64, position: 2},
      // Menu Welsh (ID 67)
      { id: 51, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 67, position: 1},
      { id: 52, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 67, position: 2},
      // Menu Carbonnade (ID 68)
      { id: 53, name: 'Choix de la Bière', is_required: true, is_multiple_choice: false, menuItemId: 68, position: 1},
      { id: 54, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 68, position: 2},
      // Menu Café Gourmand (ID 72)
      { id: 55, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 72, position: 1},
      { id: 56, name: 'Choix du Mini-Dessert', is_required: false, is_multiple_choice: true, menuItemId: 72, position: 2},

      // Restaurant 9: Jour de Pêche (Fruits de Mer)
      // Menu Plateau Royal (ID 73)
      { id: 57, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 73, position: 1},
      { id: 58, name: 'Choix de la Sauce', is_required: false, is_multiple_choice: true, menuItemId: 73, position: 2},
      // Menu Homard (ID 76)
      { id: 59, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 76, position: 1},
      { id: 60, name: 'Choix de l’Accompagnement', is_required: true, is_multiple_choice: false, menuItemId: 76, position: 2},
      // Menu Huîtres (ID 79)
      { id: 61, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 79, position: 1},
      { id: 62, name: 'Choix de la Sauce', is_required: false, is_multiple_choice: true, menuItemId: 79, position: 2},

      // Restaurant 10: L’Arc (Bistrot)
      // Menu Burrata (ID 82)
      { id: 63, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 82, position: 1},
      { id: 64, name: 'Choix du Pain', is_required: false, is_multiple_choice: false, menuItemId: 82, position: 2},
      // Menu Filet Mignon (ID 85)
      { id: 65, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 85, position: 1},
      { id: 66, name: 'Choix de la Sauce', is_required: false, is_multiple_choice: true, menuItemId: 85, position: 2},
      // Menu Dessert (ID 90)
      { id: 67, name: 'Choix de la Boisson', is_required: true, is_multiple_choice: false, menuItemId: 90, position: 1},
      { id: 68, name: 'Choix du Dessert', is_required: false, is_multiple_choice: false, menuItemId: 90, position: 2}
    ];

    for (const optionData of menuItemOptions) {
      // Créez une instance de MenuItemOption
      const menuItemOption = new MenuItemOption();
      menuItemOption.id = optionData.id;
      menuItemOption.name = optionData.name;
      menuItemOption.is_required = optionData.is_required;
      menuItemOption.is_multiple_choice = optionData.is_multiple_choice;
      menuItemOption.menuItemId = optionData.menuItemId;
      menuItemOption.position = optionData.position;

      // Utilisez save pour un comportement de type updateOrCreate
      await repo.save(menuItemOption, { data: { id: optionData.id } });
      console.log(`Menu item option ${menuItemOption.name} (ID: ${menuItemOption.id}) upserted successfully!`);
    }

    console.log('All menu item options inserted or updated successfully!');
  }
}