import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Restaurant, RestaurantStatus } from '../../domain/restaurant/entities/restaurant.entity';
import { User } from '../../domain/users/entities/user.entity';
import { RestaurantType } from '../../domain/restaurant_type/entities/restaurant_type.entity';

export class RestaurantSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Restaurant);
    const userRepo = dataSource.getRepository(User);
    const restaurantTypeRepo = dataSource.getRepository(RestaurantType);

    const userCount = await userRepo.count();
    const restaurantTypeCount = await restaurantTypeRepo.count();
    if (userCount === 0 || restaurantTypeCount === 0) {
      console.log('Aucun utilisateur ou type de restaurant trouvé. Veuillez exécuter les seeders User et RestaurantType d’abord.');
      return;
    }

    const restaurants = [
      {
        id: 1,
        name: 'La Chicorée',
        description: 'Brasserie traditionnelle servant des plats français et régionaux dans une ambiance conviviale.',
        street_number: '15',
        street: 'Place Rihour',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@lachicoree.fr',
        phone_number: '33320543952',
        siret: '12345678900011',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0628,
        lat: 50.6359,
        userId: 1,
        restaurantTypeId: 1
      },
      {
        id: 2,
        name: 'Le Barbier qui Fume',
        description: 'Restaurant spécialisé en viandes fumées et grillées, inspiré des saveurs du Nord.',
        street_number: '69',
        street: 'Rue de la Monnaie',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@lebarbierquifume.fr',
        phone_number: '33320550606',
        siret: '12345678900012',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0612,
        lat: 50.6385,
        userId: 2,
        restaurantTypeId: 9
      },
      {
        id: 3,
        name: 'L’Gaiette',
        description: 'Cuisine régionale du Nord dans un cadre chaleureux, avec des plats comme le welsh et la carbonnade.',
        street_number: '30',
        street: 'Rue de la Grande Chaussée',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@lgaiette.fr',
        phone_number: '33320540525',
        siret: '12345678900013',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0609,
        lat: 50.6382,
        userId: 3,
        restaurantTypeId: 4
      },
      {
        id: 4,
        name: 'Le Compostelle',
        description: 'Restaurant élégant proposant une cuisine française raffinée près du Vieux-Lille.',
        street_number: '4',
        street: 'Rue Saint-Étienne',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@lecompostelle.fr',
        phone_number: '33320310637',
        siret: '12345678900014',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0598,
        lat: 50.6371,
        userId: 4,
        restaurantTypeId: 3
      },
      {
        id: 5,
        name: 'N’Autre Monde',
        description: 'Cuisine créative et moderne avec des influences internationales, dans le Vieux-Lille.',
        street_number: '14',
        street: 'Rue du Curé Saint-Étienne',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@nautremonde.fr',
        phone_number: '33320551234',
        siret: '12345678900015',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0595,
        lat: 50.6373,
        userId: 5,
        restaurantTypeId: 9
      },
      {
        id: 6,
        name: 'Au Vieux de la Vieille',
        description: 'Estaminet typique du Nord avec des plats traditionnels comme le potjevleesch.',
        street_number: '2',
        street: 'Rue des Vieux Murs',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@auvieuxdelavieille.fr',
        phone_number: '33320551319',
        siret: '12345678900016',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0615,
        lat: 50.6390,
        userId: 6,
        restaurantTypeId: 4
      },
      {
        id: 7,
        name: 'La Table du Clarance',
        description: 'Restaurant gastronomique dans un hôtel de luxe, avec des produits locaux et de saison.',
        street_number: '32',
        street: 'Rue de la Barre',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@clarancehotel.com',
        phone_number: '33359363559',
        siret: '12345678900017',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0602,
        lat: 50.6388,
        userId: 7, 
        restaurantTypeId: 3
      },
      {
        id: 8,
        name: 'Le Barbue d’Anvers',
        description: 'Cuisine française et plats du Nord dans un cadre rustique et chaleureux.',
        street_number: '1',
        street: 'Rue Saint-Étienne',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@lebarbuedanvers.fr',
        phone_number: '33320551179',
        siret: '12345678900018',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0597,
        lat: 50.6370,
        userId: 8,
        restaurantTypeId: 4
      },
      {
        id: 9,
        name: 'Jour de Pêche',
        description: 'Spécialisé en poissons et fruits de mer frais, dans une ambiance moderne.',
        street_number: '9',
        street: 'Rue du Pas',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@jourdepeche.fr',
        phone_number: '33320574256',
        siret: '12345678900019',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0610,
        lat: 50.6380,
        userId: 9,
        restaurantTypeId: 5
      },
      {
        id: 10,
        name: 'L’Arc',
        description: 'Restaurant élégant avec une cuisine française contemporaine près du Grand Palais.',
        street_number: '54',
        street: 'Rue de Paris',
        city: 'Lille',
        postal_code: '59800',
        country: 'France',
        email: 'contact@larc-lille.fr',
        phone_number: '33320551234',
        siret: '12345678900020',
        is_open: true,
        status: RestaurantStatus.Active,
        long: 3.0645,
        lat: 50.6335,
        userId: 10,
        restaurantTypeId: 9
      }
    ];

    for (const restaurantData of restaurants) {
      const restaurant = new Restaurant();
      restaurant.id = restaurantData.id;
      restaurant.name = restaurantData.name;
      restaurant.description = restaurantData.description;
      restaurant.street_number = restaurantData.street_number;
      restaurant.street = restaurantData.street;
      restaurant.city = restaurantData.city;
      restaurant.postal_code = restaurantData.postal_code;
      restaurant.country = restaurantData.country;
      restaurant.email = restaurantData.email;
      restaurant.phone_number = restaurantData.phone_number;
      restaurant.siret = restaurantData.siret;
      restaurant.is_open = restaurantData.is_open;
      restaurant.status = restaurantData.status;
      restaurant.long = restaurantData.long;
      restaurant.lat = restaurantData.lat;
      restaurant.userId = restaurantData.userId;
      restaurant.restaurantTypeId = restaurantData.restaurantTypeId;

      await repo.save(restaurant, { data: { id: restaurantData.id } });
    }

    console.log('All restaurants inserted successfully!');
  }
}