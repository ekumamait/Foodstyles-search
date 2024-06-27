import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { City } from '../entities/city.entity';

export default class CreateCities implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const cities: Partial<City>[] = [
      { id: 1, name: 'London' },
      { id: 2, name: 'Birmingham' },
      { id: 3, name: 'Glasgow' },
      { id: 4, name: 'Liverpool' },
      { id: 5, name: 'Bristol' },
      { id: 6, name: 'Manchester' },
      { id: 7, name: 'Sheffield' },
      { id: 8, name: 'Leeds' },
      { id: 9, name: 'Edinburgh' },
      { id: 10, name: 'Leicester' },
      { id: 11, name: 'Coventry' },
      { id: 12, name: 'Bradford' },
      { id: 13, name: 'Cardiff' },
      { id: 14, name: 'Belfast' },
      { id: 15, name: 'Nottingham' },
      { id: 16, name: 'Derby' },
      { id: 17, name: 'Southampton' },
      { id: 18, name: 'Portsmouth' },
      { id: 19, name: 'Wolverhampton' },
      { id: 20, name: 'Plymouth' },
      { id: 21, name: 'Reading' },
      { id: 22, name: 'Swansea' },
      { id: 23, name: 'Aberdeen' },
      { id: 24, name: 'Bournemouth' },
      { id: 25, name: 'Middlesbrough' },
      { id: 26, name: 'Norwich' },
      { id: 27, name: 'Brighton and Hove' },
      { id: 28, name: 'Northampton' },
      { id: 29, name: 'York' },
      { id: 30, name: 'Blackpool' },
      { id: 31, name: 'Cambridge' },
      { id: 32, name: 'Dundee' },
      { id: 33, name: 'Ipswich' },
      { id: 34, name: 'Wolverhampton' },
      { id: 35, name: 'Luton' },
      { id: 36, name: 'Bolton' },
      { id: 37, name: 'Swindon' },
      { id: 38, name: 'Preston' },
      { id: 39, name: 'Milton Keynes' },
      { id: 40, name: 'Rotherham' },
      { id: 41, name: 'Peterborough' },
      { id: 42, name: 'Newport' },
      { id: 43, name: 'Sunderland' },
      { id: 44, name: 'Walsall' },
      { id: 45, name: 'Bury' },
      { id: 46, name: 'Crawley' },
      { id: 47, name: 'Stockport' },
      { id: 48, name: 'Dudley' },
      { id: 49, name: 'Teesside' },
      { id: 50, name: 'Brighton' },
    ];

    await connection.getRepository(City).clear();

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
