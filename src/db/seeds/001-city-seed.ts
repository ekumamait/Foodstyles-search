import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { City } from '../entities/city.entity';

export default class CreateCities implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const cities: Partial<City>[] = [
      { id: 1, name: 'London' },
      { id: 2, name: 'New York' },
      { id: 3, name: 'Paris' },
      { id: 4, name: 'Tokyo' },
      { id: 5, name: 'Los Angeles' },
      { id: 6, name: 'Berlin' },
      { id: 7, name: 'Sydney' },
      { id: 8, name: 'Rome' },
      { id: 9, name: 'Dubai' },
      { id: 10, name: 'Toronto' },
      { id: 11, name: 'Moscow' },
      { id: 12, name: 'Shanghai' },
      { id: 13, name: 'Singapore' },
      { id: 14, name: 'Mexico City' },
      { id: 15, name: 'Barcelona' },
      { id: 16, name: 'Hong Kong' },
      { id: 17, name: 'Amsterdam' },
      { id: 18, name: 'Vienna' },
      { id: 19, name: 'Cape Town' },
      { id: 20, name: 'Bangkok' },
    ];

    const citiesSeeded = await connection.manager.find(City);
    if (citiesSeeded.length === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(City)
        .values(cities)
        .execute();
    }
  }
}
