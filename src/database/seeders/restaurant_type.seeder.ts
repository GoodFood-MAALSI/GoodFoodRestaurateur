import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { RestaurantType } from '../../domain/restaurant_type/entities/restaurant_type.entity';

export class RestaurantTypeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(RestaurantType);

    const restaurantTypes = [
      {
        id: 1,
        name: 'Brasserie',
      },
      {
        id: 2,
        name: 'Pizzeria',
      },
      {
        id: 3,
        name: 'Gastronomique',
      },
      {
        id: 4,
        name: 'Estaminet',
      },
      {
        id: 5,
        name: 'Fruits de Mer',
      },
      {
        id: 6,
        name: 'Asiatique',
      },
      {
        id: 7,
        name: 'Végan',
      },
      {
        id: 8,
        name: 'Crêperie',
      },
      {
        id: 9,
        name: 'Bistrot',
      },
      {
        id: 10,
        name: 'Fast Food',
      },
    ];

    for (const typeData of restaurantTypes) {
      const restaurantType = new RestaurantType();
      restaurantType.id = typeData.id;
      restaurantType.name = typeData.name;

      await repo.save(restaurantType, { data: { id: typeData.id } });
    }

    console.log('All restaurant types inserted successfully!');
  }
}