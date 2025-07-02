import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ClientReviewRestaurant, ReviewStatus } from '../../domain/client-review-restaurant/entities/client-review-restaurant.entity';
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
        id: 1,
        review: 'Excellent service, plats délicieux et ambiance chaleureuse !',
        rating: 4,
        restaurantId: 1,
        clientId: 3, // Kylian Mbappé
        status: ReviewStatus.ACTIVE
      },
      {
        id: 2,
        review: 'Très bonne expérience, mais un peu cher.',
        rating: 3,
        restaurantId: 1,
        clientId: 7, // Raphaël Varane
        status: ReviewStatus.ACTIVE
      },
      {
        id: 3,
        review: 'Un endroit parfait pour un dîner en famille !',
        rating: 5,
        restaurantId: 1,
        clientId: 1, // Antoine Griezmann
        status: ReviewStatus.ACTIVE
      },
      {
        id: 4,
        review: 'Nourriture correcte, service à améliorer.',
        rating: 2,
        restaurantId: 1,
        clientId: 5, // Olivier Giroud
        status: ReviewStatus.ACTIVE
      },
      {
        id: 5,
        review: 'Super découverte, je recommande vivement !',
        rating: 5,
        restaurantId: 1,
        clientId: 9, // Benjamin Pavard
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 2: Le Barbier qui Fume
      {
        id: 6,
        review: 'Viandes fumées incroyables, ambiance top !',
        rating: 5,
        restaurantId: 2,
        clientId: 2, // Paul Pogba
        status: ReviewStatus.ACTIVE
      },
      {
        id: 7,
        review: 'Bon, mais portions un peu petites.',
        rating: 3,
        restaurantId: 2,
        clientId: 6, // Hugo Lloris
        status: ReviewStatus.ACTIVE
      },
      {
        id: 8,
        review: 'Service lent, mais les saveurs valent le coup.',
        rating: 4,
        restaurantId: 2,
        clientId: 8, // Ousmane Dembélé
        status: ReviewStatus.ACTIVE
      },
      {
        id: 9,
        review: 'Déçu par le dessert, sinon correct.',
        rating: 2,
        restaurantId: 2,
        clientId: 4, // N'Golo Kanté
        status: ReviewStatus.ACTIVE
      },
      {
        id: 10,
        review: 'Un must pour les amateurs de viande !',
        rating: 5,
        restaurantId: 2,
        clientId: 10, // Theo Hernandez
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 3: L’Gaiette
      {
        id: 11,
        review: 'Welsh délicieux, ambiance authentique.',
        rating: 4,
        restaurantId: 3,
        clientId: 1, // Antoine Griezmann
        status: ReviewStatus.ACTIVE
      },
      {
        id: 12,
        review: 'Carbonnade moyenne, service correct.',
        rating: 3,
        restaurantId: 3,
        clientId: 5, // Olivier Giroud
        status: ReviewStatus.ACTIVE
      },
      {
        id: 13,
        review: 'Super estaminet, je reviendrai !',
        rating: 5,
        restaurantId: 3,
        clientId: 9, // Benjamin Pavard
        status: ReviewStatus.ACTIVE
      },
      {
        id: 14,
        review: 'Attente longue, plats bons.',
        rating: 3,
        restaurantId: 3,
        clientId: 2, // Paul Pogba
        status: ReviewStatus.ACTIVE
      },
      {
        id: 15,
        review: 'Cadre chaleureux, cuisine savoureuse.',
        rating: 4,
        restaurantId: 3,
        clientId: 7, // Raphaël Varane
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 4: Le Compostelle
      {
        id: 16,
        review: 'Cuisine raffinée, expérience mémorable.',
        rating: 5,
        restaurantId: 4,
        clientId: 4, // N'Golo Kanté
        status: ReviewStatus.ACTIVE
      },
      {
        id: 17,
        review: 'Un peu guindé, mais plats excellents.',
        rating: 4,
        restaurantId: 4,
        clientId: 8, // Ousmane Dembélé
        status: ReviewStatus.ACTIVE
      },
      {
        id: 18,
        review: 'Service impeccable, prix élevés.',
        rating: 3,
        restaurantId: 4,
        clientId: 6, // Hugo Lloris
        status: ReviewStatus.ACTIVE
      },
      {
        id: 19,
        review: 'Bonne expérience, mais pas exceptionnel.',
        rating: 3,
        restaurantId: 4,
        clientId: 10, // Theo Hernandez
        status: ReviewStatus.ACTIVE
      },
      {
        id: 20,
        review: 'Parfait pour une occasion spéciale !',
        rating: 5,
        restaurantId: 4,
        clientId: 3, // Kylian Mbappé
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 5: N’Autre Monde
      {
        id: 21,
        review: 'Saveurs originales, cadre moderne.',
        rating: 5,
        restaurantId: 5,
        clientId: 7, // Raphaël Varane
        status: ReviewStatus.ACTIVE
      },
      {
        id: 22,
        review: 'Cuisine créative, mais service lent.',
        rating: 3,
        restaurantId: 5,
        clientId: 1, // Antoine Griezmann
        status: ReviewStatus.ACTIVE
      },
      {
        id: 23,
        review: 'Expérience unique, je recommande !',
        rating: 5,
        restaurantId: 5,
        clientId: 5, // Olivier Giroud
        status: ReviewStatus.ACTIVE
      },
      {
        id: 24,
        review: 'Plats inégaux, ambiance agréable.',
        rating: 2,
        restaurantId: 5,
        clientId: 9, // Benjamin Pavard
        status: ReviewStatus.ACTIVE
      },
      {
        id: 25,
        review: 'Bonne découverte, mais cher.',
        rating: 4,
        restaurantId: 5,
        clientId: 2, // Paul Pogba
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 6: Au Vieux de la Vieille
      {
        id: 26,
        review: 'Potjevleesch excellent, ambiance top !',
        rating: 5,
        restaurantId: 6,
        clientId: 6, // Hugo Lloris
        status: ReviewStatus.ACTIVE
      },
      {
        id: 27,
        review: 'Cuisine authentique, service moyen.',
        rating: 3,
        restaurantId: 6,
        clientId: 10, // Theo Hernandez
        status: ReviewStatus.ACTIVE
      },
      {
        id: 28,
        review: 'Estaminet typique, super expérience.',
        rating: 4,
        restaurantId: 6,
        clientId: 4, // N'Golo Kanté
        status: ReviewStatus.ACTIVE
      },
      {
        id: 29,
        review: 'Plats corrects, mais rien d’exceptionnel.',
        rating: 3,
        restaurantId: 6,
        clientId: 8, // Ousmane Dembélé
        status: ReviewStatus.ACTIVE
      },
      {
        id: 30,
        review: 'Un classique du Nord, à ne pas manquer !',
        rating: 5,
        restaurantId: 6,
        clientId: 3, // Kylian Mbappé
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 7: La Table du Clarance
      {
        id: 31,
        review: 'Gastronomie au top, service parfait.',
        rating: 5,
        restaurantId: 7,
        clientId: 2, // Paul Pogba
        status: ReviewStatus.ACTIVE
      },
      {
        id: 32,
        review: 'Produits frais, mais prix élevés.',
        rating: 3,
        restaurantId: 7,
        clientId: 7, // Raphaël Varane
        status: ReviewStatus.ACTIVE
      },
      {
        id: 33,
        review: 'Expérience luxueuse, plats sublimes.',
        rating: 5,
        restaurantId: 7,
        clientId: 1, // Antoine Griezmann
        status: ReviewStatus.ACTIVE
      },
      {
        id: 34,
        review: 'Service un peu guindé, cuisine bonne.',
        rating: 4,
        restaurantId: 7,
        clientId: 5, // Olivier Giroud
        status: ReviewStatus.ACTIVE
      },
      {
        id: 35,
        review: 'Déçu par le dessert, sinon top.',
        rating: 3,
        restaurantId: 7,
        clientId: 9, // Benjamin Pavard
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 8: Le Barbue d’Anvers
      {
        id: 36,
        review: 'Cadre rustique, plats savoureux.',
        rating: 4,
        restaurantId: 8,
        clientId: 3, // Kylian Mbappé
        status: ReviewStatus.ACTIVE
      },
      {
        id: 37,
        review: 'Bonne cuisine, service à améliorer.',
        rating: 3,
        restaurantId: 8,
        clientId: 8, // Ousmane Dembélé
        status: ReviewStatus.ACTIVE
      },
      {
        id: 38,
        review: 'Super endroit, je reviendrai !',
        rating: 5,
        restaurantId: 8,
        clientId: 6, // Hugo Lloris
        status: ReviewStatus.ACTIVE
      },
      {
        id: 39,
        review: 'Plats corrects, ambiance moyenne.',
        rating: 3,
        restaurantId: 8,
        clientId: 10, // Theo Hernandez
        status: ReviewStatus.ACTIVE
      },
      {
        id: 40,
        review: 'Cuisine du Nord au top, bravo !',
        rating: 5,
        restaurantId: 8,
        clientId: 4, // N'Golo Kanté
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 9: Jour de Pêche
      {
        id: 41,
        review: 'Poissons frais, service impeccable.',
        rating: 5,
        restaurantId: 9,
        clientId: 9, // Benjamin Pavard
        status: ReviewStatus.ACTIVE
      },
      {
        id: 42,
        review: 'Bonne expérience, mais cher.',
        rating: 3,
        restaurantId: 9,
        clientId: 2, // Paul Pogba
        status: ReviewStatus.ACTIVE
      },
      {
        id: 43,
        review: 'Fruits de mer délicieux, cadre moderne.',
        rating: 4,
        restaurantId: 9,
        clientId: 7, // Raphaël Varane
        status: ReviewStatus.ACTIVE
      },
      {
        id: 44,
        review: 'Service lent, plats corrects.',
        rating: 3,
        restaurantId: 9,
        clientId: 1, // Antoine Griezmann
        status: ReviewStatus.ACTIVE
      },
      {
        id: 45,
        review: 'Un régal pour les amateurs de poisson !',
        rating: 5,
        restaurantId: 9,
        clientId: 5, // Olivier Giroud
        status: ReviewStatus.ACTIVE
      },
      // Reviews for Restaurant 10: L’Arc
      {
        id: 46,
        review: 'Cuisine contemporaine, expérience top.',
        rating: 5,
        restaurantId: 10,
        clientId: 10, // Theo Hernandez
        status: ReviewStatus.ACTIVE
      },
      {
        id: 47,
        review: 'Plats raffinés, mais service lent.',
        rating: 3,
        restaurantId: 10,
        clientId: 4, // N'Golo Kanté
        status: ReviewStatus.ACTIVE
      },
      {
        id: 48,
        review: 'Cadre élégant, cuisine excellente.',
        rating: 5,
        restaurantId: 10,
        clientId: 8, // Ousmane Dembélé
        status: ReviewStatus.ACTIVE
      },
      {
        id: 49,
        review: 'Bonne expérience, mais un peu cher.',
        rating: 3,
        restaurantId: 10,
        clientId: 6, // Hugo Lloris
        status: ReviewStatus.ACTIVE
      },
      {
        id: 50,
        review: 'Parfait pour un dîner chic !',
        rating: 4,
        restaurantId: 10,
        clientId: 3, // Kylian Mbappé
        status: ReviewStatus.ACTIVE
      },
    ];

    for (const reviewData of reviews) {
      const review = new ClientReviewRestaurant();
      review.id = reviewData.id;
      review.review = reviewData.review;
      review.rating = reviewData.rating;
      review.restaurantId = reviewData.restaurantId;
      review.clientId = reviewData.clientId;
      review.status = reviewData.status;
      review.created_at = new Date();
      review.updated_at = new Date();

      await repo.save(review, { data: { id: reviewData.id } });
    }

    console.log('All client reviews inserted successfully!');
  }
}