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
        path: '/uploads/default/image-restaurant-1.jpg',
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
        path: '/uploads/default/image-restaurant-2.jpg',
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
        path: '/uploads/default/image-restaurant-3.jpg',
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
        path: '/uploads/default/image-restaurant-4.jpg',
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
        path: '/uploads/default/image-restaurant-5.jpg',
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
        path: '/uploads/default/image-restaurant-6.jpg',
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
        path: '/uploads/default/image-restaurant-7.jpg',
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
        path: '/uploads/default/image-restaurant-8.jpg',
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
        path: '/uploads/default/image-restaurant-9.jpg',
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
        path: '/uploads/default/image-restaurant-10.jpg',
        mimetype: 'image/jpeg',
        size: 4003310,
        isMain: true,
        restaurant_id: 10,
        menu_item_id: null,
        entityType: 'restaurant',
      },

      {
        id: 11,
        filename: 'menu_item_1.jpg',
        path: '/uploads/default/menu_item_1.jpg',
        mimetype: 'image/jpeg',
        size: 950193,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 1,
        entityType: 'menu_item',
      },
      {
        id: 12,
        filename: 'menu_item_2.jpg',
        path: '/uploads/default/menu_item_2.jpg',
        mimetype: 'image/jpeg',
        size: 221826,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 2,
        entityType: 'menu_item',
      },
      {
        id: 13,
        filename: 'menu_item_3.jpg',
        path: '/uploads/default/menu_item_3.jpg',
        mimetype: 'image/jpeg',
        size: 40911,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 3,
        entityType: 'menu_item',
      },
      {
        id: 14,
        filename: 'menu_item_4.jpg',
        path: '/uploads/default/menu_item_4.jpg',
        mimetype: 'image/jpeg',
        size: 686744,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 4,
        entityType: 'menu_item',
      },
      {
        id: 15,
        filename: 'menu_item_5.jpg',
        path: '/uploads/default/menu_item_5.jpg',
        mimetype: 'image/jpeg',
        size: 282884,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 5,
        entityType: 'menu_item',
      },
      {
        id: 16,
        filename: 'menu_item_6.jpg',
        path: '/uploads/default/menu_item_6.jpg',
        mimetype: 'image/jpeg',
        size: 681009,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 6,
        entityType: 'menu_item',
      },
      {
        id: 17,
        filename: 'menu_item_.jpeg7',
        path: '/uploads/default/menu_item_7.jpeg',
        mimetype: 'image/jpeg',
        size: 648043,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 7,
        entityType: 'menu_item',
      },
      {
        id: 18,
        filename: 'menu_item_8.jpg',
        path: '/uploads/default/menu_item_8.jpg',
        mimetype: 'image/jpeg',
        size: 521593,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 8,
        entityType: 'menu_item',
      },
      {
        id: 19,
        filename: 'menu_item_9.jpg',
        path: '/uploads/default/menu_item_9.jpg',
        mimetype: 'image/jpeg',
        size: 2325915,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 9,
        entityType: 'menu_item',
      },
      {
        id: 20,
        filename: 'menu_item_10.jpg',
        path: '/uploads/default/menu_item_10.jpg',
        mimetype: 'image/jpeg',
        size: 65945,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 10,
        entityType: 'menu_item',
      },
      {
        id: 21,
        filename: 'menu_item_11.jpg',
        path: '/uploads/default/menu_item_11.jpg',
        mimetype: 'image/jpeg',
        size: 162397,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 11,
        entityType: 'menu_item',
      },
      {
        id: 22,
        filename: 'menu_item_12.jpg',
        path: '/uploads/default/menu_item_12.jpg',
        mimetype: 'image/jpeg',
        size: 6836,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 12,
        entityType: 'menu_item',
      },
      {
        id: 23,
        filename: 'menu_item_13.jpg',
        path: '/uploads/default/menu_item_13.jpg',
        mimetype: 'image/jpeg',
        size: 114971,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 13,
        entityType: 'menu_item',
      },
      {
        id: 24,
        filename: 'menu_item_14.jpg',
        path: '/uploads/default/menu_item_14.jpg',
        mimetype: 'image/jpeg',
        size: 2871086,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 14,
        entityType: 'menu_item',
      },
      {
        id: 25,
        filename: 'menu_item_15.jpg',
        path: '/uploads/default/menu_item_15.jpg',
        mimetype: 'image/jpeg',
        size: 190695,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 15,
        entityType: 'menu_item',
      },
      {
        id: 26,
        filename: 'menu_item_16.jpg',
        path: '/uploads/default/menu_item_16.jpg',
        mimetype: 'image/jpeg',
        size: 672634,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 16,
        entityType: 'menu_item',
      },
      {
        id: 27,
        filename: 'menu_item_17.jpg',
        path: '/uploads/default/menu_item_17.jpg',
        mimetype: 'image/jpeg',
        size: 651700,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 17,
        entityType: 'menu_item',
      },
      {
        id: 28,
        filename: 'menu_item_18.jpg',
        path: '/uploads/default/menu_item_18.jpg',
        mimetype: 'image/jpeg',
        size: 65555,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 18,
        entityType: 'menu_item',
      },
      {
        id: 29,
        filename: 'menu_item_19.jpg',
        path: '/uploads/default/menu_item_19.jpg',
        mimetype: 'image/jpeg',
        size: 129449,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 19,
        entityType: 'menu_item',
      },
      {
        id: 30,
        filename: 'menu_item_20.jpg',
        path: '/uploads/default/menu_item_20.jpg',
        mimetype: 'image/jpeg',
        size: 51748,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 20,
        entityType: 'menu_item',
      },
      {
        id: 31,
        filename: 'menu_item_21.jpg',
        path: '/uploads/default/menu_item_21.jpg',
        mimetype: 'image/jpeg',
        size: 93147,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 21,
        entityType: 'menu_item',
      },
      {
        id: 32,
        filename: 'menu_item_22.jpg',
        path: '/uploads/default/menu_item_22.jpg',
        mimetype: 'image/jpeg',
        size: 686744,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 22,
        entityType: 'menu_item',
      },
      {
        id: 33,
        filename: 'menu_item_23.jpg',
        path: '/uploads/default/menu_item_23.jpg',
        mimetype: 'image/jpeg',
        size: 282884,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 23,
        entityType: 'menu_item',
      },
      {
        id: 34,
        filename: 'menu_item_24.jpg',
        path: '/uploads/default/menu_item_24.jpg',
        mimetype: 'image/jpeg',
        size: 203779,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 24,
        entityType: 'menu_item',
      },
      {
        id: 35,
        filename: 'menu_item_25.jpeg',
        path: '/uploads/default/menu_item_25.jpeg',
        mimetype: 'image/jpeg',
        size: 648043,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 25,
        entityType: 'menu_item',
      },
      {
        id: 36,
        filename: 'menu_item_26.jpg',
        path: '/uploads/default/menu_item_26.jpg',
        mimetype: 'image/jpeg',
        size: 36980,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 26,
        entityType: 'menu_item',
      },
      {
        id: 37,
        filename: 'menu_item_27.jpg',
        path: '/uploads/default/menu_item_27.jpg',
        mimetype: 'image/jpeg',
        size: 757129,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 27,
        entityType: 'menu_item',
      },
      {
        id: 38,
        filename: 'menu_item_28.jpg',
        path: '/uploads/default/menu_item_28.jpg',
        mimetype: 'image/jpeg',
        size: 347112,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 28,
        entityType: 'menu_item',
      },
      {
        id: 39,
        filename: 'menu_item_29.jpg',
        path: '/uploads/default/menu_item_29.jpg',
        mimetype: 'image/jpeg',
        size: 24889,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 29,
        entityType: 'menu_item',
      },
      {
        id: 40,
        filename: 'menu_item_30.jpg',
        path: '/uploads/default/menu_item_30.jpg',
        mimetype: 'image/jpeg',
        size: 729584,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 30,
        entityType: 'menu_item',
      },
      {
        id: 41,
        filename: 'menu_item_31.jpg',
        path: '/uploads/default/menu_item_31.jpg',
        mimetype: 'image/jpeg',
        size: 1365832,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 31,
        entityType: 'menu_item',
      },
      {
        id: 42,
        filename: 'menu_item_32.jpg',
        path: '/uploads/default/menu_item_32.jpg',
        mimetype: 'image/jpeg',
        size: 15272,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 32,
        entityType: 'menu_item',
      },
      {
        id: 43,
        filename: 'menu_item_33.jpg',
        path: '/uploads/default/menu_item_33.jpg',
        mimetype: 'image/jpeg',
        size: 8704,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 33,
        entityType: 'menu_item',
      },
      {
        id: 44,
        filename: 'menu_item_34.jpg',
        path: '/uploads/default/menu_item_34.jpg',
        mimetype: 'image/jpeg',
        size: 59818,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 34,
        entityType: 'menu_item',
      },
      {
        id: 45,
        filename: 'menu_item_35.jpg',
        path: '/uploads/default/menu_item_35.jpg',
        mimetype: 'image/jpeg',
        size: 434614,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 35,
        entityType: 'menu_item',
      },
      {
        id: 46,
        filename: 'menu_item_36.jpg',
        path: '/uploads/default/menu_item_36.jpg',
        mimetype: 'image/jpeg',
        size: 64936,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 36,
        entityType: 'menu_item',
      },
      {
        id: 47,
        filename: 'menu_item_37.jpg',
        path: '/uploads/default/menu_item_37.jpg',
        mimetype: 'image/jpeg',
        size: 3239415,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 37,
        entityType: 'menu_item',
      },
      {
        id: 48,
        filename: 'menu_item_38.jpg',
        path: '/uploads/default/menu_item_38.jpg',
        mimetype: 'image/jpeg',
        size: 7961,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 38,
        entityType: 'menu_item',
      },
      {
        id: 49,
        filename: 'menu_item_39.jpeg',
        path: '/uploads/default/menu_item_39.jpeg',
        mimetype: 'image/jpeg',
        size: 62181,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 39,
        entityType: 'menu_item',
      },
      {
        id: 50,
        filename: 'menu_item_40.jpg',
        path: '/uploads/default/menu_item_40.jpg',
        mimetype: 'image/jpeg',
        size: 986116,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 40,
        entityType: 'menu_item',
      },
      {
        id: 51,
        filename: 'menu_item_41.jpg',
        path: '/uploads/default/menu_item_41.jpg',
        mimetype: 'image/jpeg',
        size: 2550441,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 41,
        entityType: 'menu_item',
      },
      {
        id: 52,
        filename: 'menu_item_42.jpg',
        path: '/uploads/default/menu_item_42.jpg',
        mimetype: 'image/jpeg',
        size: 157253,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 42,
        entityType: 'menu_item',
      },
      {
        id: 53,
        filename: 'menu_item_43.jpg',
        path: '/uploads/default/menu_item_43.jpg',
        mimetype: 'image/jpeg',
        size: 77708,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 43,
        entityType: 'menu_item',
      },
      {
        id: 54,
        filename: 'menu_item_44.jpg',
        path: '/uploads/default/menu_item_44.jpg',
        mimetype: 'image/jpeg',
        size: 199589,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 44,
        entityType: 'menu_item',
      },
      {
        id: 55,
        filename: 'menu_item_45.jpg',
        path: '/uploads/default/menu_item_45.jpg',
        mimetype: 'image/jpeg',
        size: 491876,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 45,
        entityType: 'menu_item',
      },
      {
        id: 56,
        filename: 'menu_item_46.jpg',
        path: '/uploads/default/menu_item_46.jpg',
        mimetype: 'image/jpeg',
        size: 85221,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 46,
        entityType: 'menu_item',
      },
      {
        id: 57,
        filename: 'menu_item_47.jpg',
        path: '/uploads/default/menu_item_47.jpg',
        mimetype: 'image/jpeg',
        size: 178757,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 47,
        entityType: 'menu_item',
      },
      {
        id: 58,
        filename: 'menu_item_48.png',
        path: '/uploads/default/menu_item_48.png',
        mimetype: 'image/png',
        size: 1035118,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 48,
        entityType: 'menu_item',
      },
      {
        id: 59,
        filename: 'menu_item_49.jpg',
        path: '/uploads/default/menu_item_49.jpg',
        mimetype: 'image/jpeg',
        size: 129449,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 49,
        entityType: 'menu_item',
      },
      {
        id: 60,
        filename: 'menu_item_50.jpg',
        path: '/uploads/default/menu_item_50.jpg',
        mimetype: 'image/jpeg',
        size: 686744,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 50,
        entityType: 'menu_item',
      },
      {
        id: 61,
        filename: 'menu_item_51.jpg',
        path: '/uploads/default/menu_item_51.jpg',
        mimetype: 'image/jpeg',
        size: 68143,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 51,
        entityType: 'menu_item',
      },
      {
        id: 62,
        filename: 'menu_item_52.jpg',
        path: '/uploads/default/menu_item_52.jpg',
        mimetype: 'image/jpeg',
        size: 628835,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 52,
        entityType: 'menu_item',
      },
      {
        id: 63,
        filename: 'menu_item_53.jpg',
        path: '/uploads/default/menu_item_53.jpg',
        mimetype: 'image/jpeg',
        size: 268049,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 53,
        entityType: 'menu_item',
      },
      {
        id: 64,
        filename: 'menu_item_54.jpg',
        path: '/uploads/default/menu_item_54.jpg',
        mimetype: 'image/jpeg',
        size: 757129,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 54,
        entityType: 'menu_item',
      },
      {
        id: 65,
        filename: 'menu_item_55.jpg',
        path: '/uploads/default/menu_item_55.jpg',
        mimetype: 'image/jpeg',
        size: 44771,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 55,
        entityType: 'menu_item',
      },
      {
        id: 66,
        filename: 'menu_item_56.jpg',
        path: '/uploads/default/menu_item_56.jpg',
        mimetype: 'image/jpeg',
        size: 24483,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 56,
        entityType: 'menu_item',
      },
      {
        id: 67,
        filename: 'menu_item_57.jpeg',
        path: '/uploads/default/menu_item_57.jpeg',
        mimetype: 'image/jpeg',
        size: 48347,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 57,
        entityType: 'menu_item',
      },
      {
        id: 68,
        filename: 'menu_item_58.jpeg',
        path: '/uploads/default/menu_item_58.jpeg',
        mimetype: 'image/jpeg',
        size: 95303,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 58,
        entityType: 'menu_item',
      },
      {
        id: 69,
        filename: 'menu_item_59.jpg',
        path: '/uploads/default/menu_item_59.jpg',
        mimetype: 'image/jpeg',
        size: 40129,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 59,
        entityType: 'menu_item',
      },
      {
        id: 70,
        filename: 'menu_item_60.jpg',
        path: '/uploads/default/menu_item_60.jpg',
        mimetype: 'image/jpeg',
        size: 26732,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 60,
        entityType: 'menu_item',
      },
      {
        id: 71,
        filename: 'menu_item_61.jpg',
        path: '/uploads/default/menu_item_61.jpg',
        mimetype: 'image/jpeg',
        size: 37064,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 61,
        entityType: 'menu_item',
      },
      {
        id: 72,
        filename: 'menu_item_62.jpg',
        path: '/uploads/default/menu_item_62.jpg',
        mimetype: 'image/jpeg',
        size: 73913,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 62,
        entityType: 'menu_item',
      },
      {
        id: 73,
        filename: 'menu_item_63.jpg',
        path: '/uploads/default/menu_item_63.jpg',
        mimetype: 'image/jpeg',
        size: 23180,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 63,
        entityType: 'menu_item',
      },
      {
        id: 74,
        filename: 'menu_item_64.jpg',
        path: '/uploads/default/menu_item_64.jpg',
        mimetype: 'image/jpeg',
        size: 7155,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 64,
        entityType: 'menu_item',
      },
      {
        id: 75,
        filename: 'menu_item_65.jpeg',
        path: '/uploads/default/menu_item_65.jpeg',
        mimetype: 'image/jpeg',
        size: 115345,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 65,
        entityType: 'menu_item',
      },
      {
        id: 76,
        filename: 'menu_item_66.jpg',
        path: '/uploads/default/menu_item_66.jpg',
        mimetype: 'image/jpeg',
        size: 1867845,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 66,
        entityType: 'menu_item',
      },
      {
        id: 77,
        filename: 'menu_item_67.jpg',
        path: '/uploads/default/menu_item_67.jpg',
        mimetype: 'image/jpeg',
        size: 282884,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 67,
        entityType: 'menu_item',
      },
      {
        id: 78,
        filename: 'menu_item_68.jpg',
        path: '/uploads/default/menu_item_68.jpg',
        mimetype: 'image/jpeg',
        size: 268855,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 68,
        entityType: 'menu_item',
      },
      {
        id: 79,
        filename: 'menu_item_69.jpg',
        path: '/uploads/default/menu_item_69.jpg',
        mimetype: 'image/jpeg',
        size: 44382,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 69,
        entityType: 'menu_item',
      },
      {
        id: 80,
        filename: 'menu_item_70.jpg',
        path: '/uploads/default/menu_item_70.jpg',
        mimetype: 'image/jpeg',
        size: 580119,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 70,
        entityType: 'menu_item',
      },
      {
        id: 81,
        filename: 'menu_item_71.jpg',
        path: '/uploads/default/menu_item_71.jpg',
        mimetype: 'image/jpeg',
        size: 36980,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 71,
        entityType: 'menu_item',
      },
      {
        id: 82,
        filename: 'menu_item_72.jpg',
        path: '/uploads/default/menu_item_72.jpg',
        mimetype: 'image/jpeg',
        size: 432444,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 72,
        entityType: 'menu_item',
      },
      {
        id: 83,
        filename: 'menu_item_73.jpg',
        path: '/uploads/default/menu_item_73.jpg',
        mimetype: 'image/jpeg',
        size: 389101,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 73,
        entityType: 'menu_item',
      },
      {
        id: 84,
        filename: 'menu_item_74.jpg',
        path: '/uploads/default/menu_item_74.jpg',
        mimetype: 'image/jpeg',
        size: 62802,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 74,
        entityType: 'menu_item',
      },
      {
        id: 85,
        filename: 'menu_item_75.jpg',
        path: '/uploads/default/menu_item_75.jpg',
        mimetype: 'image/jpeg',
        size: 1531252,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 75,
        entityType: 'menu_item',
      },
      {
        id: 86,
        filename: 'menu_item_76.jpeg',
        path: '/uploads/default/menu_item_76.jpeg',
        mimetype: 'image/jpeg',
        size: 781706,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 76,
        entityType: 'menu_item',
      },
      {
        id: 87,
        filename: 'menu_item_77.jpg',
        path: '/uploads/default/menu_item_77.jpg',
        mimetype: 'image/jpeg',
        size: 384574,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 77,
        entityType: 'menu_item',
      },
      {
        id: 88,
        filename: 'menu_item_78.jpg',
        path: '/uploads/default/menu_item_78.jpg',
        mimetype: 'image/jpeg',
        size: 206818,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 78,
        entityType: 'menu_item',
      },
      {
        id: 89,
        filename: 'menu_item_79.jpg',
        path: '/uploads/default/menu_item_79.jpg',
        mimetype: 'image/jpeg',
        size: 1263212,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 79,
        entityType: 'menu_item',
      },
      {
        id: 90,
        filename: 'menu_item_80.jpg',
        path: '/uploads/default/menu_item_80.jpg',
        mimetype: 'image/jpeg',
        size: 1154616,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 80,
        entityType: 'menu_item',
      },
      {
        id: 91,
        filename: 'menu_item_81.jpg',
        path: '/uploads/default/menu_item_81.jpg',
        mimetype: 'image/jpeg',
        size: 75943,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 81,
        entityType: 'menu_item',
      },
      {
        id: 92,
        filename: 'menu_item_82.jpg',
        path: '/uploads/default/menu_item_82.jpg',
        mimetype: 'image/jpeg',
        size: 1591223,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 82,
        entityType: 'menu_item',
      },
      {
        id: 93,
        filename: 'menu_item_83.jpg',
        path: '/uploads/default/menu_item_83.jpg',
        mimetype: 'image/jpeg',
        size: 278840,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 83,
        entityType: 'menu_item',
      },
      {
        id: 94,
        filename: 'menu_item_84.jpg',
        path: '/uploads/default/menu_item_84.jpg',
        mimetype: 'image/jpeg',
        size: 165999,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 84,
        entityType: 'menu_item',
      },
      {
        id: 95,
        filename: 'menu_item_85.jpg',
        path: '/uploads/default/menu_item_85.jpg',
        mimetype: 'image/jpeg',
        size: 1365832,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 85,
        entityType: 'menu_item',
      },
      {
        id: 96,
        filename: 'menu_item_86.jpg',
        path: '/uploads/default/menu_item_86.jpg',
        mimetype: 'image/jpeg',
        size: 2550441,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 86,
        entityType: 'menu_item',
      },
      {
        id: 97,
        filename: 'menu_item_87.jpg',
        path: '/uploads/default/menu_item_87.jpg',
        mimetype: 'image/jpeg',
        size: 897155,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 87,
        entityType: 'menu_item',
      },
      {
        id: 98,
        filename: 'menu_item_88.jpg',
        path: '/uploads/default/menu_item_88.jpg',
        mimetype: 'image/jpeg',
        size: 1439854,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 88,
        entityType: 'menu_item',
      },
      {
        id: 99,
        filename: 'menu_item_89.jpg',
        path: '/uploads/default/menu_item_89.jpg',
        mimetype: 'image/jpeg',
        size: 64750,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 89,
        entityType: 'menu_item',
      },
      {
        id: 100,
        filename: 'menu_item_90.jpg',
        path: '/uploads/default/menu_item_90.jpg',
        mimetype: 'image/jpeg',
        size: 73264,
        isMain: true,
        restaurant_id: null,
        menu_item_id: 90,
        entityType: 'menu_item',
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
