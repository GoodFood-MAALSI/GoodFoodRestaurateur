import 'dotenv/config';
import { DataSource } from 'typeorm';

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Entities path:', process.env.NODE_ENV === 'production' ? 'dist/domain/**/*.entity.js' : 'src/domain/**/*.entity{.ts,.js}');
console.log('Migrations path:', process.env.NODE_ENV === 'production' ? 'dist/database/migrations/*.js' : 'src/database/migrations/*{.ts,.js}');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [process.env.NODE_ENV === 'production' ? 'dist/domain/**/*.entity.js' : 'src/domain/**/*.entity{.ts,.js}'],
  migrations: [process.env.NODE_ENV === 'production' ? 'dist/database/migrations/*.js' : 'src/database/migrations/*{.ts,.js}'],
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: true,
});

export default AppDataSource;