import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { MenuItem } from '../../domain/menu_items/entities/menu_item.entity';
import { MenuCategory } from '../../domain/menu_categories/entities/menu_category.entity';

export class MenuItemSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(MenuItem);
    const menuCategoryRepo = dataSource.getRepository(MenuCategory);

    // Vérifiez si des catégories de menu existent
    const menuCategoryCount = await menuCategoryRepo.count();
    if (menuCategoryCount === 0) {
      console.log('Aucune catégorie de menu trouvée. Veuillez exécuter le seeder MenuCategory d’abord.');
      return;
    }

    const menuItems = [
      // Restaurant 1: La Chicorée (Brasserie)
      // Catégorie: Entrées (menuCategoryId: 1)
      { id: 1, name: 'Menu Salade Ch’ti', price: 12.00, description: 'Salade verte, maroilles, pommes, noix, pain grillé, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 1 , position: 1},
      { id: 2, name: 'Tartare de Saumon', price: 9.00, description: 'Saumon frais, citron, aneth, échalotes.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 1 , position: 2},
      { id: 3, name: 'Œuf Mimosa', price: 7.00, description: 'Œuf dur, mayonnaise maison, herbes.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 1 , position: 3},
      // Catégorie: Plats (menuCategoryId: 2)
      { id: 4, name: 'Menu Carbonnade', price: 18.50, description: 'Bœuf mijoté à la bière, frites maison, salade, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 2 , position: 1},
      { id: 5, name: 'Menu Welsh', price: 16.00, description: 'Cheddar fondu, jambon, œuf, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 2 , position: 2},
      { id: 6, name: 'Moules Marinières', price: 13.50, description: 'Moules fraîches, sauce marinière, frites.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 2 , position: 3},
      // Catégorie: Desserts (menuCategoryId: 3)
      { id: 7, name: 'Tarte au Sucre', price: 6.50, description: 'Tarte sucrée du Nord, crème fouettée.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 3 , position: 1},
      { id: 8, name: 'Crème Brûlée', price: 7.00, description: 'Crème vanillée, caramel craquant.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 3 , position: 2},
      { id: 9, name: 'Menu Gaufre', price: 8.00, description: 'Gaufre de Lille, sucre glace, chantilly, boisson chaude.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 3 , position: 3},

      // Restaurant 2: Le Barbier qui Fume (Bistrot)
      // Catégorie: Entrées du Nord (menuCategoryId: 4)
      { id: 10, name: 'Menu Rillettes', price: 11.00, description: 'Rillettes de porc maison, pain grillé, cornichons, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 4 , position: 1},
      { id: 11, name: 'Velouté de Potiron', price: 7.50, description: 'Soupe de potiron, crème fraîche.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 4 , position: 2},
      { id: 12, name: 'Croquettes de Crevettes', price: 9.00, description: 'Croquettes croustillantes, sauce tartare.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 4 , position: 3},
      // Catégorie: Viandes Fumées (menuCategoryId: 5)
      { id: 13, name: 'Menu Côte de Porc', price: 20.00, description: 'Côte de porc fumée, purée maison, salade, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 5 , position: 1},
      { id: 14, name: 'Menu Saucisse', price: 18.50, description: 'Saucisse de Morteau fumée, lentilles, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 5 , position: 2},
      { id: 15, name: 'Poulet Fumé', price: 16.00, description: 'Poulet rôti fumé, légumes rôtis.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 5 , position: 3},
      // Catégorie: Accompagnements (menuCategoryId: 6)
      { id: 16, name: 'Frites Maison', price: 4.50, description: 'Frites croustillantes, mayonnaise.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 6 , position: 1},
      { id: 17, name: 'Salade Verte', price: 4.00, description: 'Salade fraîche, vinaigrette maison.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 6 , position: 2},
      { id: 18, name: 'Légumes Rôtis', price: 5.00, description: 'Carottes, courgettes, poivrons rôtis.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 6 , position: 3},

      // Restaurant 3: L’Gaiette (Estaminet)
      // Catégorie: Spécialités Régionales (menuCategoryId: 7)
      { id: 19, name: 'Menu Potjevleesch', price: 17.50, description: 'Terrine de viandes en gelée, frites, salade, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 7 , position: 1},
      { id: 20, name: 'Waterzooi de Poulet', price: 15.00, description: 'Ragoût crémeux de poulet, légumes.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 7 , position: 2},
      { id: 21, name: 'Flamiche au Maroilles', price: 13.50, description: 'Tarte salée au fromage maroilles.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 7 , position: 3},
      // Catégorie: Plats Traditionnels (menuCategoryId: 8)
      { id: 22, name: 'Menu Carbonnade', price: 18.00, description: 'Bœuf mijoté à la bière, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 8 , position: 1},
      { id: 23, name: 'Menu Welsh', price: 16.50, description: 'Cheddar fondu, jambon, œuf, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 8 , position: 2},
      { id: 24, name: 'Lapin à la Moutarde', price: 14.50, description: 'Lapin mijoté, sauce moutarde, purée.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 8 , position: 3},
      // Catégorie: Desserts du Nord (menuCategoryId: 9)
      { id: 25, name: 'Tarte au Sucre', price: 6.00, description: 'Tarte sucrée du Nord.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 9 , position: 1},
      { id: 26, name: 'Merveilleux', price: 6.50, description: 'Meringue, chantilly, chocolat.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 9 , position: 2},
      { id: 27, name: 'Menu Café Gourmand', price: 8.00, description: 'Café avec trois mini-desserts.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 9 , position: 3},

      // Restaurant 4: Le Compostelle (Gastronomique)
      // Catégorie: Amuse-Bouches (menuCategoryId: 10)
      { id: 28, name: 'Velouté de Homard', price: 12.00, description: 'Soupe de homard, écume de truffe.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 10 , position: 1},
      { id: 29, name: 'Tartare de Saint-Jacques', price: 14.00, description: 'Saint-Jacques, citron vert, caviar.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 10 , position: 2},
      { id: 30, name: 'Menu Amuse-Bouche', price: 16.00, description: 'Sélection de trois amuse-bouches, verre de vin.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 10 , position: 3},
      // Catégorie: Plats Principaux (menuCategoryId: 11)
      { id: 31, name: 'Menu Filet Mignon', price: 32.00, description: 'Filet mignon, sauce aux cèpes, légumes, vin rouge.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 11 , position: 1},
      { id: 32, name: 'Risotto aux Truffes', price: 28.00, description: 'Risotto crémeux, lamelles de truffes.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 11 , position: 2},
      { id: 33, name: 'Cabillaud Rôti', price: 26.00, description: 'Cabillaud, sauce vierge, écrasé de pommes de terre.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 11 , position: 3},
      // Catégorie: Desserts Raffinés (menuCategoryId: 12)
      { id: 34, name: 'Sphère Chocolat', price: 10.00, description: 'Chocolat noir, cœur coulant, glace vanille.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 12 , position: 1},
      { id: 35, name: 'Tarte Citron Revisité', price: 9.50, description: 'Tarte citron, meringue légère.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 12 , position: 2},
      { id: 36, name: 'Menu Dessert', price: 12.00, description: 'Dessert du chef, café ou thé inclus.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 12 , position: 3},

      // Restaurant 5: N’Autre Monde (Bistrot)
      // Catégorie: Entrées Créatives (menuCategoryId: 13)
      { id: 37, name: 'Menu Carpaccio', price: 13.00, description: 'Carpaccio de bœuf, roquette, parmesan, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 13 , position: 1},
      { id: 38, name: 'Ravioles de Chèvre', price: 10.00, description: 'Ravioles, miel, noisettes grillées.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 13 , position: 2},
      { id: 39, name: 'Ceviche de Daurade', price: 11.00, description: 'Daurade marinée, citron vert, coriandre.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 13 , position: 3},
      // Catégorie: Plats Signature (menuCategoryId: 14)
      { id: 40, name: 'Menu Magret', price: 22.00, description: 'Magret de canard, sauce au miel, légumes, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 14 , position: 1},
      { id: 41, name: 'Burger Gourmet', price: 18.00, description: 'Burger, foie gras, confit d’oignons, frites.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 14 , position: 2},
      { id: 42, name: 'Risotto Végétarien', price: 16.00, description: 'Risotto, légumes de saison, parmesan.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 14 , position: 3},
      // Catégorie: Desserts Originaux (menuCategoryId: 15)
      { id: 43, name: 'Panna Cotta Exotique', price: 7.50, description: 'Panna cotta, coulis de mangue.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 15 , position: 1},
      { id: 44, name: 'Tiramisu Revisité', price: 8.00, description: 'Tiramisu, spéculoos, café.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 15 , position: 2},
      { id: 45, name: 'Menu Dessert', price: 9.50, description: 'Dessert surprise, boisson chaude incluse.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 15 , position: 3},

      // Restaurant 6: Au Vieux de la Vieille (Estaminet)
      // Catégorie: Entrées Régionales (menuCategoryId: 16)
      { id: 46, name: 'Menu Maroilles', price: 11.50, description: 'Tartelette au maroilles, salade, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 16 , position: 1},
      { id: 47, name: 'Soupe à l’Oignon', price: 7.00, description: 'Soupe gratinée, croûtons, fromage.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 16 , position: 2},
      { id: 48, name: 'Terrine Maison', price: 8.00, description: 'Terrine de campagne, cornichons.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 16 , position: 3},
      // Catégorie: Plats du Terroir (menuCategoryId: 17)
      { id: 49, name: 'Menu Potjevleesch', price: 18.00, description: 'Terrine de viandes, frites, salade, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 17 , position: 1},
      { id: 50, name: 'Menu Carbonnade', price: 17.50, description: 'Bœuf à la bière, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 17 , position: 2},
      { id: 51, name: 'Andouillette Grillée', price: 14.00, description: 'Andouillette, moutarde, frites.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 17 , position: 3},
      // Catégorie: Douceurs Locales (menuCategoryId: 18)
      { id: 52, name: 'Gaufre au Sucre', price: 6.00, description: 'Gaufre fine, sucre glace.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 18 , position: 1},
      { id: 53, name: 'Tarte au Speculoos', price: 6.50, description: 'Tarte, crème speculoos.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 18 , position: 2},
      { id: 54, name: 'Menu Café Gourmand', price: 8.00, description: 'Café avec trois mini-desserts.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 18 , position: 3},

      // Restaurant 7: La Table du Clarance (Gastronomique)
      // Catégorie: Menu Dégustation (menuCategoryId: 19)
      { id: 55, name: 'Menu Entrée', price: 20.00, description: 'Entrée du jour, accord mets-vins.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 19 , position: 1},
      { id: 56, name: 'Foie Gras Poêlé', price: 18.00, description: 'Foie gras, chutney de figues.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 19 , position: 2},
      { id: 57, name: 'Cappuccino de Cèpes', price: 16.00, description: 'Velouté de cèpes, écume de lait.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 19 , position: 3},
      // Catégorie: Plats de Saison (menuCategoryId: 20)
      { id: 58, name: 'Menu Dégustation', price: 45.00, description: 'Trois plats de saison, accord mets-vins.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 20 , position: 1},
      { id: 59, name: 'Agneau Rôti', price: 32.00, description: 'Agneau, jus réduit, légumes de saison.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 20 , position: 2},
      { id: 60, name: 'Bar en Croûte', price: 30.00, description: 'Bar, croûte de sel, sauce vierge.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 20 , position: 3},
      // Catégorie: Desserts d’Exception (menuCategoryId: 21)
      { id: 61, name: 'Dôme Chocolat', price: 12.00, description: 'Chocolat noir, cœur framboise.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 21 , position: 1},
      { id: 62, name: 'Soufflé au Grand Marnier', price: 11.00, description: 'Soufflé léger, crème anglaise.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 21 , position: 2},
      { id: 63, name: 'Menu Dessert', price: 14.00, description: 'Dessert signature, café inclus.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 21 , position: 3},

      // Restaurant 8: Le Barbue d’Anvers (Estaminet)
      // Catégorie: Entrées Ch’ti (menuCategoryId: 22)
      { id: 64, name: 'Menu Terrine', price: 11.00, description: 'Terrine de campagne, cornichons, pain, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 22 , position: 1},
      { id: 65, name: 'Flamiche aux Poireaux', price: 8.50, description: 'Tarte salée aux poireaux.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 22 , position: 2},
      { id: 66, name: 'Salade au Maroilles', price: 9.00, description: 'Salade, maroilles, lardons.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 22 , position: 3},
      // Catégorie: Plats Chaleureux (menuCategoryId: 23)
      { id: 67, name: 'Menu Welsh', price: 16.50, description: 'Cheddar fondu, jambon, œuf, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 23 , position: 1},
      { id: 68, name: 'Menu Carbonnade', price: 17.50, description: 'Bœuf à la bière, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 23 , position: 2},
      { id: 69, name: 'Hochepot', price: 15.00, description: 'Ragoût de viandes et légumes.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 23 , position: 3},
      // Catégorie: Desserts Traditionnels (menuCategoryId: 24)
      { id: 70, name: 'Tarte au Sucre', price: 6.00, description: 'Tarte sucrée du Nord.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 24 , position: 1},
      { id: 71, name: 'Merveilleux', price: 6.50, description: 'Meringue, chantilly, chocolat.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 24 , position: 2},
      { id: 72, name: 'Menu Café Gourmand', price: 8.00, description: 'Café avec trois mini-desserts.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 24 , position: 3},

      // Restaurant 9: Jour de Pêche (Fruits de Mer)
      // Catégorie: Plateaux de Fruits de Mer (menuCategoryId: 25)
      { id: 73, name: 'Menu Plateau Royal', price: 35.00, description: 'Huîtres, crevettes, langoustines, bulots, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 25 , position: 1},
      { id: 74, name: 'Plateau Découverte', price: 28.00, description: 'Huîtres, moules, crevettes, citron.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 25 , position: 2},
      { id: 75, name: 'Assiette de Fruits de Mer', price: 22.00, description: 'Crevettes, bulots, huîtres.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 25 , position: 3},
      // Catégorie: Poissons et Crustacés (menuCategoryId: 26)
      { id: 76, name: 'Menu Homard', price: 40.00, description: 'Homard grillé, beurre citronné, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 26 , position: 1},
      { id: 77, name: 'Filet de Bar', price: 24.00, description: 'Bar rôti, sauce vierge, légumes.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 26 , position: 2},
      { id: 78, name: 'Crevettes à l’Ail', price: 20.00, description: 'Crevettes sautées, ail, persil.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 26 , position: 3},
      // Catégorie: Entrées Marines (menuCategoryId: 27)
      { id: 79, name: 'Menu Huîtres', price: 15.00, description: 'Six huîtres fines de claire, citron, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 27 , position: 1},
      { id: 80, name: 'Tartare de Thon', price: 12.00, description: 'Thon frais, avocat, sésame.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 27 , position: 2},
      { id: 81, name: 'Soupe de Poissons', price: 10.00, description: 'Soupe maison, croûtons, rouille.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 27 , position: 3},

      // Restaurant 10: L’Arc (Bistrot)
      // Catégorie: Entrées Modernes (menuCategoryId: 28)
      { id: 82, name: 'Menu Burrata', price: 13.50, description: 'Burrata, tomates cerises, basilic, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 28 , position: 1},
      { id: 83, name: 'Carpaccio de Bœuf', price: 11.00, description: 'Bœuf finement tranché, parmesan, roquette.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 28 , position: 2},
      { id: 84, name: 'Velouté de Butternut', price: 9.00, description: 'Soupe de butternut, graines torréfiées.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 28 , position: 3},
      // Catégorie: Plats Contemporains (menuCategoryId: 29)
      { id: 85, name: 'Menu Filet Mignon', price: 24.00, description: 'Filet mignon, sauce au poivre, frites, boisson au choix.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 29 , position: 1},
      { id: 86, name: 'Burger Signature', price: 18.00, description: 'Burger, cheddar affiné, confit d’oignons.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 29 , position: 2},
      { id: 87, name: 'Saumon Grillé', price: 20.00, description: 'Saumon, sauce citronnée, riz sauvage.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 29 , position: 3},
      // Catégorie: Desserts Élégants (menuCategoryId: 30)
      { id: 88, name: 'Fondant au Chocolat', price: 8.00, description: 'Chocolat noir, cœur coulant, glace vanille.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 30 , position: 1},
      { id: 89, name: 'Tarte aux Pommes', price: 7.50, description: 'Tarte fine, pommes caramélisées.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 30 , position: 2},
      { id: 90, name: 'Menu Dessert', price: 10.00, description: 'Dessert du jour, café inclus.', picture: 'base64_placeholder', promotion: 0, is_available: true, menuCategoryId: 30, position: 3}
    ];

    for (const itemData of menuItems) {
      // Créez une instance de MenuItem
      const menuItem = new MenuItem();
      menuItem.id = itemData.id;
      menuItem.name = itemData.name;
      menuItem.price = itemData.price;
      menuItem.description = itemData.description;
      menuItem.picture = itemData.picture;
      menuItem.promotion = itemData.promotion;
      menuItem.is_available = itemData.is_available;
      menuItem.menuCategoryId = itemData.menuCategoryId;
      menuItem.position = itemData.position;

      // Utilisez save pour un comportement de type updateOrCreate
      await repo.save(menuItem, { data: { id: itemData.id } });
      console.log(`Menu item ${menuItem.name} (ID: ${menuItem.id}) upserted successfully!`);
    }

    console.log('All menu items inserted or updated successfully!');
  }
}