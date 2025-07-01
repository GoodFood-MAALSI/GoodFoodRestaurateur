import { User, UserRole, UserStatus } from '../../domain/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(User);

    const users = [
      {
        id: 1,
        email: 'antoine.griezmann@goodfood-maalsi.com',
        password: 'Antoine123!',
        status: UserStatus.Active,
        first_name: 'Antoine',
        last_name: 'Griezmann',
        role: UserRole.Restaurateur,
      },
      {
        id: 2,
        email: 'paul.pogba@goodfood-maalsi.com',
        password: 'Paul123!',
        status: UserStatus.Active,
        first_name: 'Paul',
        last_name: 'Pogba',
        role: UserRole.Restaurateur,
      },
      {
        id: 3,
        email: 'kylian.mbappe@goodfood-maalsi.com',
        password: 'Kylian123!',
        status: UserStatus.Active,
        first_name: 'Kylian',
        last_name: 'Mbappé',
        role: UserRole.Restaurateur,
      },
      {
        id: 4,
        email: 'ngolo.kante@goodfood-maalsi.com',
        password: 'Ngolo123!',
        status: UserStatus.Active,
        first_name: 'N\'Golo',
        last_name: 'Kanté',
        role: UserRole.Restaurateur,
      },
      {
        id: 5,
        email: 'olivier.giroud@goodfood-maalsi.com',
        password: 'Olivier123!',
        status: UserStatus.Active,
        first_name: 'Olivier',
        last_name: 'Giroud',
        role: UserRole.Restaurateur,
      },
      {
        id: 6,
        email: 'hugo.lloris@goodfood-maalsi.com',
        password: 'Hugo123!',
        status: UserStatus.Active,
        first_name: 'Hugo',
        last_name: 'Lloris',
        role: UserRole.Restaurateur,
      },
      {
        id: 7,
        email: 'raphael.varane@goodfood-maalsi.com',
        password: 'Raphael123!',
        status: UserStatus.Active,
        first_name: 'Raphaël',
        last_name: 'Varane',
        role: UserRole.Restaurateur,
      },
      {
        id: 8,
        email: 'ousmane.dembele@goodfood-maalsi.com',
        password: 'Ousmane123!',
        status: UserStatus.Active,
        first_name: 'Ousmane',
        last_name: 'Dembélé',
        role: UserRole.Restaurateur,
      },
      {
        id: 9,
        email: 'benjamin.pavard@goodfood-maalsi.com',
        password: 'Benjamin123!',
        status: UserStatus.Active,
        first_name: 'Benjamin',
        last_name: 'Pavard',
        role: UserRole.Restaurateur,
      },
      {
        id: 10,
        email: 'theo.hernandez@goodfood-maalsi.com',
        password: 'Theo123!',
        status: UserStatus.Active,
        first_name: 'Theo',
        last_name: 'Hernandez',
        role: UserRole.Restaurateur,
      }
    ];

    for (const userData of users) {
      const user = new User();
      user.id = userData.id;
      user.email = userData.email;
      user.password = userData.password;
      user.status = userData.status;
      user.first_name = userData.first_name;
      user.last_name = userData.last_name;
      user.role = userData.role;

      await repo.save(user, { data: { id: userData.id } });
    }

    console.log('All users inserted or updated successfully!');
  }
}