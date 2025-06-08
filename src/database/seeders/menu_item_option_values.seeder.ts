import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { MenuItemOptionValue } from '../../domain/menu_item_option_values/entities/menu_item_option_value.entity';
import { MenuItemOption } from '../../domain/menu_item_options/entities/menu_item_option.entity';

export class MenuItemOptionValueSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(MenuItemOptionValue);
    const menuItemOptionRepo = dataSource.getRepository(MenuItemOption);

    // Vérifiez si des options existent
    const menuItemOptionCount = await menuItemOptionRepo.count();
    if (menuItemOptionCount === 0) {
      console.log('Aucune option trouvée. Veuillez exécuter le seeder MenuItemOption d’abord.');
      return;
    }

    const menuItemOptionValues = [
      // Restaurant 1: La Chicorée (Brasserie)
      // Menu Salade Ch’ti: Choix de la Boisson (ID 1)
      { id: 1, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 1, position: 1},
      { id: 2, name: 'Bière Blonde', extra_price: 1.00, menuItemOptionId: 1, position: 2},
      { id: 3, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 1, position: 3},
      // Menu Salade Ch’ti: Choix du Pain (ID 2)
      { id: 4, name: 'Pain de Campagne', extra_price: 0.00, menuItemOptionId: 2, position: 1},
      { id: 5, name: 'Pain aux Noix', extra_price: 0.50, menuItemOptionId: 2, position: 2},
      { id: 6, name: 'Baguette', extra_price: 0.00, menuItemOptionId: 2, position: 3},
      // Menu Carbonnade: Choix de la Boisson (ID 3)
      { id: 7, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 3, position: 1},
      { id: 8, name: 'Bière Ambrée', extra_price: 1.00, menuItemOptionId: 3, position: 2},
      { id: 9, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 3, position: 3},
      // Menu Carbonnade: Choix de l’Accompagnement (ID 4)
      { id: 10, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 4, position: 1},
      { id: 11, name: 'Salade Verte', extra_price: 0.00, menuItemOptionId: 4, position: 2},
      { id: 12, name: 'Légumes Poêlés', extra_price: 1.50, menuItemOptionId: 4, position: 3},
      // Menu Welsh: Choix de la Boisson (ID 5)
      { id: 13, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 5, position: 1},
      { id: 14, name: 'Bière Blonde', extra_price: 1.00, menuItemOptionId: 5, position: 2},
      { id: 15, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 5, position: 3},
      // Menu Welsh: Choix de l’Accompagnement (ID 6)
      { id: 16, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 6, position: 1},
      { id: 17, name: 'Salade Ch’ti', extra_price: 0.50, menuItemOptionId: 6, position: 2},
      { id: 18, name: 'Légumes Rôtis', extra_price: 1.00, menuItemOptionId: 6, position: 3},
      // Menu Gaufre: Choix de la Boisson (ID 7)
      { id: 19, name: 'Café', extra_price: 0.00, menuItemOptionId: 7, position: 1},
      { id: 20, name: 'Thé', extra_price: 0.00, menuItemOptionId: 7, position: 2},
      { id: 21, name: 'Chocolat Chaud', extra_price: 0.50, menuItemOptionId: 7, position: 3},
      // Menu Gaufre: Choix de la Garniture (ID 8)
      { id: 22, name: 'Chantilly', extra_price: 0.50, menuItemOptionId: 8, position: 1},
      { id: 23, name: 'Sucre Glace', extra_price: 0.00, menuItemOptionId: 8, position: 2},
      { id: 24, name: 'Sirop d’Érable', extra_price: 0.50, menuItemOptionId: 8, position: 3},

      // Restaurant 2: Le Barbier qui Fume (Bistrot)
      // Menu Rillettes: Choix de la Boisson (ID 9)
      { id: 25, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 9, position: 1},
      { id: 26, name: 'Vin Rouge', extra_price: 2.00, menuItemOptionId: 9, position: 2},
      { id: 27, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 9, position: 3},
      // Menu Rillettes: Choix du Pain (ID 10)
      { id: 28, name: 'Pain de Campagne', extra_price: 0.00, menuItemOptionId: 10, position: 1},
      { id: 29, name: 'Pain aux Céréales', extra_price: 0.50, menuItemOptionId: 10, position: 2},
      { id: 30, name: 'Baguette', extra_price: 0.00, menuItemOptionId: 10, position: 3},
      // Menu Côte de Porc: Choix de la Boisson (ID 11)
      { id: 31, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 11, position: 1},
      { id: 32, name: 'Vin Blanc', extra_price: 2.00, menuItemOptionId: 11, position: 2},
      { id: 33, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 11, position: 3},
      // Menu Côte de Porc: Choix de la Sauce (ID 12)
      { id: 34, name: 'Sauce BBQ', extra_price: 0.50, menuItemOptionId: 12, position: 1},
      { id: 35, name: 'Sauce Moutarde', extra_price: 0.50, menuItemOptionId: 12, position: 2},
      { id: 36, name: 'Sauce Aïoli', extra_price: 0.50, menuItemOptionId: 12, position: 3},
      // Menu Saucisse: Choix de la Boisson (ID 13)
      { id: 37, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 13, position: 1},
      { id: 38, name: 'Vin Rouge', extra_price: 2.00, menuItemOptionId: 13, position: 2},
      { id: 39, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 13, position: 3},
      // Menu Saucisse: Choix de l’Accompagnement (ID 14)
      { id: 40, name: 'Purée Maison', extra_price: 0.00, menuItemOptionId: 14, position: 1},
      { id: 41, name: 'Lentilles du Puy', extra_price: 0.00, menuItemOptionId: 14, position: 2},
      { id: 42, name: 'Légumes Rôtis', extra_price: 1.00, menuItemOptionId: 14, position: 3},

      // Restaurant 3: L’Gaiette (Estaminet)
      // Menu Potjevleesch: Choix de la Bière (ID 15)
      { id: 43, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 15, position: 1},
      { id: 44, name: 'Bière Ambrée', extra_price: 0.50, menuItemOptionId: 15, position: 2},
      { id: 45, name: 'Bière Triple', extra_price: 1.00, menuItemOptionId: 15, position: 3},
      // Menu Potjevleesch: Choix de l’Accompagnement (ID 16)
      { id: 46, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 16, position: 1},
      { id: 47, name: 'Salade Ch’ti', extra_price: 0.50, menuItemOptionId: 16, position: 2},
      { id: 48, name: 'Légumes du Marché', extra_price: 1.00, menuItemOptionId: 16, position: 3},
      // Menu Carbonnade: Choix de la Bière (ID 17)
      { id: 49, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 17, position: 1},
      { id: 50, name: 'Bière Brune', extra_price: 0.50, menuItemOptionId: 17, position: 2},
      { id: 51, name: 'Bière Artisanale', extra_price: 1.00, menuItemOptionId: 17, position: 3},
      // Menu Carbonnade: Choix de l’Accompagnement (ID 18)
      { id: 52, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 18, position: 1},
      { id: 53, name: 'Salade Verte', extra_price: 0.00, menuItemOptionId: 18, position: 2},
      { id: 54, name: 'Légumes Poêlés', extra_price: 1.00, menuItemOptionId: 18, position: 3},
      // Menu Welsh: Choix de la Bière (ID 19)
      { id: 55, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 19, position: 1},
      { id: 56, name: 'Bière Ambrée', extra_price: 0.50, menuItemOptionId: 19, position: 2},
      { id: 57, name: 'Bière Triple', extra_price: 1.00, menuItemOptionId: 19, position: 3},
      // Menu Welsh: Choix de l’Accompagnement (ID 20)
      { id: 58, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 20, position: 1},
      { id: 59, name: 'Salade Ch’ti', extra_price: 0.50, menuItemOptionId: 20, position: 2},
      { id: 60, name: 'Légumes Rôtis', extra_price: 1.00, menuItemOptionId: 20, position: 3},
      // Menu Café Gourmand: Choix de la Boisson (ID 21)
      { id: 61, name: 'Café', extra_price: 0.00, menuItemOptionId: 21, position: 1},
      { id: 62, name: 'Thé', extra_price: 0.00, menuItemOptionId: 21, position: 2},
      { id: 63, name: 'Chocolat Chaud', extra_price: 0.50, menuItemOptionId: 21, position: 3},
      // Menu Café Gourmand: Choix du Mini-Dessert (ID 22)
      { id: 64, name: 'Tarte au Sucre', extra_price: 0.00, menuItemOptionId: 22, position: 1},
      { id: 65, name: 'Merveilleux', extra_price: 0.50, menuItemOptionId: 22, position: 2},
      { id: 66, name: 'Crème Brûlée', extra_price: 0.50, menuItemOptionId: 22, position: 3},

      // Restaurant 4: Le Compostelle (Gastronomique)
      // Menu Amuse-Bouche: Choix du Vin (ID 23)
      { id: 67, name: 'Bordeaux Rouge', extra_price: 5.00, menuItemOptionId: 23, position: 1},
      { id: 68, name: 'Chardonnay Blanc', extra_price: 4.00, menuItemOptionId: 23, position: 2},
      { id: 69, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 23, position: 3},
      // Menu Amuse-Bouche: Choix de l’Amuse-Bouche (ID 24)
      { id: 70, name: 'Velouté de Homard', extra_price: 0.00, menuItemOptionId: 24, position: 1},
      { id: 71, name: 'Tartare de Saint-Jacques', extra_price: 0.00, menuItemOptionId: 24, position: 2},
      { id: 72, name: 'Cappuccino de Cèpes', extra_price: 0.00, menuItemOptionId: 24, position: 3},
      // Menu Filet Mignon: Choix du Vin (ID 25)
      { id: 73, name: 'Bordeaux Rouge', extra_price: 5.00, menuItemOptionId: 25, position: 1},
      { id: 74, name: 'Sancerre Blanc', extra_price: 4.00, menuItemOptionId: 25, position: 2},
      { id: 75, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 25, position: 3},
      // Menu Filet Mignon: Choix de l’Accompagnement (ID 26)
      { id: 76, name: 'Légumes de Saison', extra_price: 0.00, menuItemOptionId: 26, position: 1},
      { id: 77, name: 'Pommes Dauphines', extra_price: 1.00, menuItemOptionId: 26, position: 2},
      { id: 78, name: 'Risotto', extra_price: 2.00, menuItemOptionId: 26, position: 3},
      // Menu Dessert: Choix du Vin (ID 27)
      { id: 79, name: 'Vin Moelleux', extra_price: 4.00, menuItemOptionId: 27, position: 1},
      { id: 80, name: 'Café', extra_price: 0.00, menuItemOptionId: 27, position: 2},
      { id: 81, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 27, position: 3},
      // Menu Dessert: Choix du Dessert (ID 28)
      { id: 82, name: 'Sphère Chocolat', extra_price: 0.00, menuItemOptionId: 28, position: 1},
      { id: 83, name: 'Tarte Citron', extra_price: 0.00, menuItemOptionId: 28, position: 2},
      { id: 84, name: 'Soufflé Grand Marnier', extra_price: 1.00, menuItemOptionId: 28, position: 3},

      // Restaurant 5: N’Autre Monde (Bistrot)
      // Menu Carpaccio: Choix de la Boisson (ID 29)
      { id: 85, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 29, position: 1},
      { id: 86, name: 'Vin Blanc', extra_price: 2.00, menuItemOptionId: 29, position: 2},
      { id: 87, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 29, position: 3},
      // Menu Carpaccio: Choix du Pain (ID 30)
      { id: 88, name: 'Pain de Campagne', extra_price: 0.00, menuItemOptionId: 30, position: 1},
      { id: 89, name: 'Pain aux Noix', extra_price: 0.50, menuItemOptionId: 30, position: 2},
      { id: 90, name: 'Baguette', extra_price: 0.00, menuItemOptionId: 30, position: 3},
      // Menu Magret: Choix de la Boisson (ID 31)
      { id: 91, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 31, position: 1},
      { id: 92, name: 'Vin Rouge', extra_price: 2.00, menuItemOptionId: 31, position: 2},
      { id: 93, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 31, position: 3},
      // Menu Magret: Choix de la Sauce (ID 32)
      { id: 94, name: 'Sauce au Miel', extra_price: 0.50, menuItemOptionId: 32, position: 1},
      { id: 95, name: 'Sauce Poivre', extra_price: 0.50, menuItemOptionId: 32, position: 2},
      { id: 96, name: 'Sauce Béarnaise', extra_price: 0.50, menuItemOptionId: 32, position: 3},
      // Menu Dessert: Choix de la Boisson (ID 33)
      { id: 97, name: 'Café', extra_price: 0.00, menuItemOptionId: 33, position: 1},
      { id: 98, name: 'Thé', extra_price: 0.00, menuItemOptionId: 33, position: 2},
      { id: 99, name: 'Chocolat Chaud', extra_price: 0.50, menuItemOptionId: 33, position: 3},
      // Menu Dessert: Choix du Dessert (ID 34)
      { id: 100, name: 'Panna Cotta', extra_price: 0.00, menuItemOptionId: 34, position: 1},
      { id: 101, name: 'Tiramisu', extra_price: 0.50, menuItemOptionId: 34, position: 2},
      { id: 102, name: 'Fondant Chocolat', extra_price: 1.00, menuItemOptionId: 34, position: 3},

      // Restaurant 6: Au Vieux de la Vieille (Estaminet)
      // Menu Maroilles: Choix de la Bière (ID 35)
      { id: 103, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 35, position: 1},
      { id: 104, name: 'Bière Ambrée', extra_price: 0.50, menuItemOptionId: 35, position: 2},
      { id: 105, name: 'Bière Triple', extra_price: 1.00, menuItemOptionId: 35, position: 3},
      // Menu Maroilles: Choix du Pain (ID 36)
      { id: 106, name: 'Pain de Campagne', extra_price: 0.00, menuItemOptionId: 36, position: 1},
      { id: 107, name: 'Pain aux Céréales', extra_price: 0.50, menuItemOptionId: 36, position: 2},
      { id: 108, name: 'Baguette', extra_price: 0.00, menuItemOptionId: 36, position: 3},
      // Menu Potjevleesch: Choix de la Bière (ID 37)
      { id: 109, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 37, position: 1},
      { id: 110, name: 'Bière Brune', extra_price: 0.50, menuItemOptionId: 37, position: 2},
      { id: 111, name: 'Bière Artisanale', extra_price: 1.00, menuItemOptionId: 37, position: 3},
      // Menu Potjevleesch: Choix de l’Accompagnement (ID 38)
      { id: 112, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 38, position: 1},
      { id: 113, name: 'Salade Ch’ti', extra_price: 0.50, menuItemOptionId: 38, position: 2},
      { id: 114, name: 'Légumes du Marché', extra_price: 1.00, menuItemOptionId: 38, position: 3},
      // Menu Carbonnade: Choix de la Bière (ID 39)
      { id: 115, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 39, position: 1},
      { id: 116, name: 'Bière Ambrée', extra_price: 0.50, menuItemOptionId: 39, position: 2},
      { id: 117, name: 'Bière Triple', extra_price: 1.00, menuItemOptionId: 39, position: 3},
      // Menu Carbonnade: Choix de l’Accompagnement (ID 40)
      { id: 118, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 40, position: 1},
      { id: 119, name: 'Salade Verte', extra_price: 0.00, menuItemOptionId: 40, position: 2},
      { id: 120, name: 'Légumes Poêlés', extra_price: 1.00, menuItemOptionId: 40, position: 3},
      // Menu Café Gourmand: Choix de la Boisson (ID 41)
      { id: 121, name: 'Café', extra_price: 0.00, menuItemOptionId: 41, position: 1},
      { id: 122, name: 'Thé', extra_price: 0.00, menuItemOptionId: 41, position: 2},
      { id: 123, name: 'Chocolat Chaud', extra_price: 0.50, menuItemOptionId: 41, position: 3},
      // Menu Café Gourmand: Choix du Mini-Dessert (ID 42)
      { id: 124, name: 'Gaufre au Sucre', extra_price: 0.00, menuItemOptionId: 42, position: 1},
      { id: 125, name: 'Tarte Speculoos', extra_price: 0.50, menuItemOptionId: 42, position: 2},
      { id: 126, name: 'Merveilleux', extra_price: 0.50, menuItemOptionId: 42, position: 3},

      // Restaurant 7: La Table du Clarance (Gastronomique)
      // Menu Entrée: Choix du Vin (ID 43)
      { id: 127, name: 'Sancerre Blanc', extra_price: 5.00, menuItemOptionId: 43, position: 1},
      { id: 128, name: 'Châteauneuf-du-Pape', extra_price: 6.00, menuItemOptionId: 43, position: 2},
      { id: 129, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 43, position: 3},
      // Menu Entrée: Choix de l’Entrée (ID 44)
      { id: 130, name: 'Foie Gras Poêlé', extra_price: 0.00, menuItemOptionId: 44, position: 1},
      { id: 131, name: 'Cappuccino de Cèpes', extra_price: 0.00, menuItemOptionId: 44, position: 2},
      { id: 132, name: 'Tartare de Saint-Jacques', extra_price: 0.00, menuItemOptionId: 44, position: 3},
      // Menu Dégustation: Choix du Vin (ID 45)
      { id: 133, name: 'Bordeaux Rouge', extra_price: 5.00, menuItemOptionId: 45, position: 1},
      { id: 134, name: 'Sancerre Blanc', extra_price: 4.00, menuItemOptionId: 45, position: 2},
      { id: 135, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 45, position: 3},
      // Menu Dégustation: Choix du Plat (ID 46)
      { id: 136, name: 'Agneau Rôti', extra_price: 0.00, menuItemOptionId: 46, position: 1},
      { id: 137, name: 'Bar en Croûte', extra_price: 0.00, menuItemOptionId: 46, position: 2},
      { id: 138, name: 'Risotto aux Truffes', extra_price: 2.00, menuItemOptionId: 46, position: 3},
      // Menu Dessert: Choix du Vin (ID 47)
      { id: 139, name: 'Vin Moelleux', extra_price: 4.00, menuItemOptionId: 47, position: 1},
      { id: 140, name: 'Café', extra_price: 0.00, menuItemOptionId: 47, position: 2},
      { id: 141, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 47, position: 3},
      // Menu Dessert: Choix du Dessert (ID 48)
      { id: 142, name: 'Dôme Chocolat', extra_price: 0.00, menuItemOptionId: 48, position: 1},
      { id: 143, name: 'Soufflé Grand Marnier', extra_price: 1.00, menuItemOptionId: 48, position: 2},
      { id: 144, name: 'Tarte aux Fruits', extra_price: 0.50, menuItemOptionId: 48, position: 3},

      // Restaurant 8: Le Barbue d’Anvers (Estaminet)
      // Menu Terrine: Choix de la Bière (ID 49)
      { id: 145, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 49, position: 1},
      { id: 146, name: 'Bière Brune', extra_price: 0.50, menuItemOptionId: 49, position: 2},
      { id: 147, name: 'Bière Artisanale', extra_price: 1.00, menuItemOptionId: 49, position: 3},
      // Menu Terrine: Choix du Pain (ID 50)
      { id: 148, name: 'Pain de Campagne', extra_price: 0.00, menuItemOptionId: 50, position: 1},
      { id: 149, name: 'Pain aux Céréales', extra_price: 0.50, menuItemOptionId: 50, position: 2},
      { id: 150, name: 'Baguette', extra_price: 0.00, menuItemOptionId: 50, position: 3},
      // Menu Welsh: Choix de la Bière (ID 51)
      { id: 151, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 51, position: 1},
      { id: 152, name: 'Bière Ambrée', extra_price: 0.50, menuItemOptionId: 51, position: 2},
      { id: 153, name: 'Bière Triple', extra_price: 1.00, menuItemOptionId: 51, position: 1},
      // Menu Welsh: Choix de l’Accompagnement (ID 52)
      { id: 154, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 52, position: 1},
      { id: 155, name: 'Salade Ch’ti', extra_price: 0.50, menuItemOptionId: 52, position: 2},
      { id: 156, name: 'Légumes Rôtis', extra_price: 1.00, menuItemOptionId: 52, position: 3},
      // Menu Carbonnade: Choix de la Bière (ID 53)
      { id: 157, name: 'Bière Blonde', extra_price: 0.00, menuItemOptionId: 53, position: 1},
      { id: 158, name: 'Bière Brune', extra_price: 0.50, menuItemOptionId: 53, position: 2},
      { id: 159, name: 'Bière Artisanale', extra_price: 1.00, menuItemOptionId: 53, position: 3},
      // Menu Carbonnade: Choix de l’Accompagnement (ID 54)
      { id: 160, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 54, position: 1},
      { id: 161, name: 'Salade Verte', extra_price: 0.00, menuItemOptionId: 54, position: 2},
      { id: 162, name: 'Légumes Poêlés', extra_price: 1.00, menuItemOptionId: 54, position: 3},
      // Menu Café Gourmand: Choix de la Boisson (ID 55)
      { id: 163, name: 'Café', extra_price: 0.00, menuItemOptionId: 55, position: 1},
      { id: 164, name: 'Thé', extra_price: 0.00, menuItemOptionId: 55, position: 2},
      { id: 165, name: 'Chocolat Chaud', extra_price: 0.50, menuItemOptionId: 55, position: 3},
      // Menu Café Gourmand: Choix du Mini-Dessert (ID 56)
      { id: 166, name: 'Tarte au Sucre', extra_price: 0.00, menuItemOptionId: 56, position: 1},
      { id: 167, name: 'Merveilleux', extra_price: 0.50, menuItemOptionId: 56, position: 2},
      { id: 168, name: 'Crème Brûlée', extra_price: 0.50, menuItemOptionId: 56, position: 3},

      // Restaurant 9: Jour de Pêche (Fruits de Mer)
      // Menu Plateau Royal: Choix de la Boisson (ID 57)
      { id: 169, name: 'Vin Blanc', extra_price: 2.00, menuItemOptionId: 57, position: 1},
      { id: 170, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 57, position: 2},
      { id: 171, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 57, position: 3},
      // Menu Plateau Royal: Choix de la Sauce (ID 58)
      { id: 172, name: 'Sauce Citronnée', extra_price: 0.50, menuItemOptionId: 58, position: 1},
      { id: 173, name: 'Sauce Aïoli', extra_price: 0.50, menuItemOptionId: 58, position: 2},
      { id: 174, name: 'Sauce Tartare', extra_price: 0.50, menuItemOptionId: 58, position: 3},
      // Menu Homard: Choix de la Boisson (ID 59)
      { id: 175, name: 'Vin Blanc', extra_price: 2.00, menuItemOptionId: 59, position: 1},
      { id: 176, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 59, position: 2},
      { id: 177, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 59, position: 3},
      // Menu Homard: Choix de l’Accompagnement (ID 60)
      { id: 178, name: 'Frites Maison', extra_price: 0.00, menuItemOptionId: 60, position: 1},
      { id: 179, name: 'Légumes Verts', extra_price: 1.00, menuItemOptionId: 60, position: 2},
      { id: 180, name: 'Riz Pilaf', extra_price: 0.50, menuItemOptionId: 60, position: 3},
      // Menu Huîtres: Choix de la Boisson (ID 61)
      { id: 181, name: 'Vin Blanc', extra_price: 2.00, menuItemOptionId: 61, position: 1},
      { id: 182, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 61, position: 2},
      { id: 183, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 61, position: 3},
      // Menu Huîtres: Choix de la Sauce (ID 62)
      { id: 184, name: 'Sauce Échalote', extra_price: 0.50, menuItemOptionId: 62, position: 1},
      { id: 185, name: 'Sauce Citronnée', extra_price: 0.50, menuItemOptionId: 62, position: 2},
      { id: 186, name: 'Sauce Tartare', extra_price: 0.50, menuItemOptionId: 62, position: 3},

      // Restaurant 10: L’Arc (Bistrot)
      // Menu Burrata: Choix de la Boisson (ID 63)
      { id: 187, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 63, position: 1},
      { id: 188, name: 'Vin Rouge', extra_price: 2.00, menuItemOptionId: 63, position: 2},
      { id: 189, name: 'Eau Gazeuse', extra_price: 0.00, menuItemOptionId: 63, position: 3},
      // Menu Burrata: Choix du Pain (ID 64)
      { id: 190, name: 'Pain de Campagne', extra_price: 0.00, menuItemOptionId: 64, position: 1},
      { id: 191, name: 'Pain aux Noix', extra_price: 0.50, menuItemOptionId: 64, position: 2},
      { id: 192, name: 'Baguette', extra_price: 0.00, menuItemOptionId: 64, position: 3},
      // Menu Filet Mignon: Choix de la Boisson (ID 65)
      { id: 193, name: 'Coca Cola', extra_price: 0.00, menuItemOptionId: 65, position: 1},
      { id: 194, name: 'Vin Blanc', extra_price: 2.00, menuItemOptionId: 65, position: 2},
      { id: 195, name: 'Eau Plate', extra_price: 0.00, menuItemOptionId: 65, position: 3},
      // Menu Filet Mignon: Choix de la Sauce (ID 66)
      { id: 196, name: 'Sauce Poivre', extra_price: 0.50, menuItemOptionId: 66, position: 1},
      { id: 197, name: 'Sauce Béarnaise', extra_price: 0.50, menuItemOptionId: 66, position: 2},
      { id: 198, name: 'Sauce Moutarde', extra_price: 0.50, menuItemOptionId: 66, position: 3},
      // Menu Dessert: Choix de la Boisson (ID 67)
      { id: 199, name: 'Café', extra_price: 0.00, menuItemOptionId: 67, position: 1},
      { id: 200, name: 'Thé', extra_price: 0.00, menuItemOptionId: 67, position: 2},
      { id: 201, name: 'Chocolat Chaud', extra_price: 0.50, menuItemOptionId: 67, position: 3},
      // Menu Dessert: Choix du Dessert (ID 68)
      { id: 202, name: 'Fondant Chocolat', extra_price: 0.00, menuItemOptionId: 68, position: 1},
      { id: 203, name: 'Tarte aux Pommes', extra_price: 0.00, menuItemOptionId: 68, position: 2},
      { id: 204, name: 'Panna Cotta', extra_price: 0.50, menuItemOptionId: 68, position: 3}
    ];

    for (const valueData of menuItemOptionValues) {
      const menuItemOptionValue = new MenuItemOptionValue();
      menuItemOptionValue.id = valueData.id;
      menuItemOptionValue.name = valueData.name;
      menuItemOptionValue.extra_price = valueData.extra_price;
      menuItemOptionValue.menuItemOptionId = valueData.menuItemOptionId;
      menuItemOptionValue.position = valueData.position;

      // Utilisez save pour un comportement de type updateOrCreate
      await repo.save(menuItemOptionValue, { data: { id: valueData.id } });
      console.log(`Menu item option value ${menuItemOptionValue.name} (ID: ${menuItemOptionValue.id}) upserted successfully!`);
    }

    console.log('All menu item option values inserted or updated successfully!');
  }
}