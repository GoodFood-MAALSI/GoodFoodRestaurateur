import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ClientReviewRestaurant } from '../../domain/client-review-restaurant/entities/client-review-restaurant.entity';
import { Restaurant } from '../../domain/restaurant/entities/restaurant.entity';

export class ClientReviewRestaurantSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(ClientReviewRestaurant);
    const restaurantRepo = dataSource.getRepository(Restaurant);

    const restaurantCount = await restaurantRepo.count();
    if (restaurantCount < 10) {
      console.log(
        'Aucun restaurant trouvé. Veuillez exécuter le seeder Restaurantd’abord.',
      );
      return;
    }

    const reviews = [
      // Reviews for Restaurant 1: La Chicorée
      {
        review: 'Excellent service, plats délicieux et ambiance chaleureuse !',
        rating: 4,
        restaurantId: 1,
        clientId: 3, // Kylian Mbappé
      },
      {
        review: 'Très bonne expérience, mais un peu cher.',
        rating: 3,
        restaurantId: 1,
        clientId: 7, // Raphaël Varane
      },
      {
        review: 'Un endroit parfait pour un dîner en famille !',
        rating: 5,
        restaurantId: 1,
        clientId: 1, // Antoine Griezmann
      },
      {
        review: 'Nourriture correcte, service à améliorer.',
        rating: 2,
        restaurantId: 1,
        clientId: 5, // Olivier Giroud
      },
      {
        review: 'Super découverte, je recommande vivement !',
        rating: 5,
        restaurantId: 1,
        clientId: 9, // Benjamin Pavard
      },
      // Reviews for Restaurant 2: Le Barbier qui Fume
      {
        review: 'Viandes fumées incroyables, ambiance top !',
        rating: 5,
        restaurantId: 2,
        clientId: 2, // Paul Pogba
      },
      {
        review: 'Bon, mais portions un peu petites.',
        rating: 3,
        restaurantId: 2,
        clientId: 6, // Hugo Lloris
      },
      {
        review: 'Service lent, mais les saveurs valent le coup.',
        rating: 4,
        restaurantId: 2,
        clientId: 8, // Ousmane Dembélé
      },
      {
        review: 'Déçu par le dessert, sinon correct.',
        rating: 2,
        restaurantId: 2,
        clientId: 4, // N'Golo Kanté
      },
      {
        review: 'Un must pour les amateurs de viande !',
        rating: 5,
        restaurantId: 2,
        clientId: 10, // Theo Hernandez
      },
      // Reviews for Restaurant 3: L’Gaiette
      {
        review: 'Welsh délicieux, ambiance authentique.',
        rating: 4,
        restaurantId: 3,
        clientId: 1, // Antoine Griezmann
      },
      {
        review: 'Carbonnade moyenne, service correct.',
        rating: 3,
        restaurantId: 3,
        clientId: 5, // Olivier Giroud
      },
      {
        review: 'Super estaminet, je reviendrai !',
        rating: 5,
        restaurantId: 3,
        clientId: 9, // Benjamin Pavard
      },
      {
        review: 'Attente longue, plats bons.',
        rating: 3,
        restaurantId: 3,
        clientId: 2, // Paul Pogba
      },
      {
        review: 'Cadre chaleureux, cuisine savoureuse.',
        rating: 4,
        restaurantId: 3,
        clientId: 7, // Raphaël Varane
      },
      // Reviews for Restaurant 4: Le Compostelle
      {
        review: 'Cuisine raffinée, expérience mémorable.',
        rating: 5,
        restaurantId: 4,
        clientId: 4, // N'Golo Kanté
      },
      {
        review: 'Un peu guindé, mais plats excellents.',
        rating: 4,
        restaurantId: 4,
        clientId: 8, // Ousmane Dembélé
      },
      {
        review: 'Service impeccable, prix élevés.',
        rating: 3,
        restaurantId: 4,
        clientId: 6, // Hugo Lloris
      },
      {
        review: 'Bonne expérience, mais pas exceptionnel.',
        rating: 3,
        restaurantId: 4,
        clientId: 10, // Theo Hernandez
      },
      {
        review: 'Parfait pour une occasion spéciale !',
        rating: 5,
        restaurantId: 4,
        clientId: 3, // Kylian Mbappé
      },
      // Reviews for Restaurant 5: N’Autre Monde
      {
        review: 'Saveurs originales, cadre moderne.',
        rating: 5,
        restaurantId: 5,
        clientId: 7, // Raphaël Varane
      },
      {
        review: 'Cuisine créative, mais service lent.',
        rating: 3,
        restaurantId: 5,
        clientId: 1, // Antoine Griezmann
      },
      {
        review: 'Expérience unique, je recommande !',
        rating: 5,
        restaurantId: 5,
        clientId: 5, // Olivier Giroud
      },
      {
        review: 'Plats inégaux, ambiance agréable.',
        rating: 2,
        restaurantId: 5,
        clientId: 9, // Benjamin Pavard
      },
      {
        review: 'Bonne découverte, mais cher.',
        rating: 4,
        restaurantId: 5,
        clientId: 2, // Paul Pogba
      },
      // Reviews for Restaurant 6: Au Vieux de la Vieille
      {
        review: 'Potjevleesch excellent, ambiance top !',
        rating: 5,
        restaurantId: 6,
        clientId: 6, // Hugo Lloris
      },
      {
        review: 'Cuisine authentique, service moyen.',
        rating: 3,
        restaurantId: 6,
        clientId: 10, // Theo Hernandez
      },
      {
        review: 'Estaminet typique, super expérience.',
        rating: 4,
        restaurantId: 6,
        clientId: 4, // N'Golo Kanté
      },
      {
        review: 'Plats corrects, mais rien d’exceptionnel.',
        rating: 3,
        restaurantId: 6,
        clientId: 8, // Ousmane Dembélé
      },
      {
        review: 'Un classique du Nord, à ne pas manquer !',
        rating: 5,
        restaurantId: 6,
        clientId: 3, // Kylian Mbappé
      },
      // Reviews for Restaurant 7: La Table du Clarance
      {
        review: 'Gastronomie au top, service parfait.',
        rating: 5,
        restaurantId: 7,
        clientId: 2, // Paul Pogba
      },
      {
        review: 'Produits frais, mais prix élevés.',
        rating: 3,
        restaurantId: 7,
        clientId: 7, // Raphaël Varane
      },
      {
        review: 'Expérience luxueuse, plats sublimes.',
        rating: 5,
        restaurantId: 7,
        clientId: 1, // Antoine Griezmann
      },
      {
        review: 'Service un peu guindé, cuisine bonne.',
        rating: 4,
        restaurantId: 7,
        clientId: 5, // Olivier Giroud
      },
      {
        review: 'Déçu par le dessert, sinon top.',
        rating: 3,
        restaurantId: 7,
        clientId: 9, // Benjamin Pavard
      },
      // Reviews for Restaurant 8: Le Barbue d’Anvers
      {
        review: 'Cadre rustique, plats savoureux.',
        rating: 4,
        restaurantId: 8,
        clientId: 3, // Kylian Mbappé
      },
      {
        review: 'Bonne cuisine, service à améliorer.',
        rating: 3,
        restaurantId: 8,
        clientId: 8, // Ousmane Dembélé
      },
      {
        review: 'Super endroit, je reviendrai !',
        rating: 5,
        restaurantId: 8,
        clientId: 6, // Hugo Lloris
      },
      {
        review: 'Plats corrects, ambiance moyenne.',
        rating: 3,
        restaurantId: 8,
        clientId: 10, // Theo Hernandez
      },
      {
        review: 'Cuisine du Nord au top, bravo !',
        rating: 5,
        restaurantId: 8,
        clientId: 4, // N'Golo Kanté
      },
      // Reviews for Restaurant 9: Jour de Pêche
      {
        review: 'Poissons frais, service impeccable.',
        rating: 5,
        restaurantId: 9,
        clientId: 9, // Benjamin Pavard
      },
      {
        review: 'Bonne expérience, mais cher.',
        rating: 3,
        restaurantId: 9,
        clientId: 2, // Paul Pogba
      },
      {
        review: 'Fruits de mer délicieux, cadre moderne.',
        rating: 4,
        restaurantId: 9,
        clientId: 7, // Raphaël Varane
      },
      {
        review: 'Service lent, plats corrects.',
        rating: 3,
        restaurantId: 9,
        clientId: 1, // Antoine Griezmann
      },
      {
        review: 'Un régal pour les amateurs de poisson !',
        rating: 5,
        restaurantId: 9,
        clientId: 5, // Olivier Giroud
      },
      // Reviews for Restaurant 10: L’Arc
      {
        review: 'Cuisine contemporaine, expérience top.',
        rating: 5,
        restaurantId: 10,
        clientId: 10, // Theo Hernandez
      },
      {
        review: 'Plats raffinés, mais service lent.',
        rating: 3,
        restaurantId: 10,
        clientId: 4, // N'Golo Kanté
      },
      {
        review: 'Cadre élégant, cuisine excellente.',
        rating: 5,
        restaurantId: 10,
        clientId: 8, // Ousmane Dembélé
      },
      {
        review: 'Bonne expérience, mais un peu cher.',
        rating: 3,
        restaurantId: 10,
        clientId: 6, // Hugo Lloris
      },
      {
        review: 'Parfait pour un dîner chic !',
        rating: 4,
        restaurantId: 10,
        clientId: 3, // Kylian Mbappé
      },
    ];

    for (const reviewData of reviews) {
      const review = new ClientReviewRestaurant();
      review.review = reviewData.review;
      review.rating = reviewData.rating;
      review.restaurantId = reviewData.restaurantId;
      review.clientId = reviewData.clientId;
      review.created_at = new Date();
      review.updated_at = new Date();

      await repo.save(review);
    }

    console.log('All client reviews inserted successfully!');
  }
}