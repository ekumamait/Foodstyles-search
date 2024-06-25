import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Brand } from '../entities/brand.entity';

export default class CreateBrands implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const brands: Partial<Brand>[] = [
      { id: 1, name: 'McDonald\'s' },
      { id: 2, name: 'Starbucks' },
      { id: 3, name: 'Burger King' },
      { id: 4, name: 'KFC' },
      { id: 5, name: 'Subway' },
      { id: 6, name: 'Pizza Hut' },
      { id: 7, name: 'Taco Bell' },
      { id: 8, name: 'Chipotle Mexican Grill' },
      { id: 9, name: 'Panera Bread' },
      { id: 10, name: 'Dunkin\' Donuts' },
      { id: 11, name: 'Wendy\'s' },
      { id: 12, name: 'Domino\'s Pizza' },
      { id: 13, name: 'Papa John\'s Pizza' },
      { id: 14, name: 'Dairy Queen' },
      { id: 15, name: 'Cinnabon' },
      { id: 16, name: 'Popeyes Louisiana Kitchen' },
      { id: 17, name: 'Five Guys' },
      { id: 18, name: 'In-N-Out Burger' },
      { id: 19, name: 'Jimmy John\'s' },
      { id: 20, name: 'Chick-fil-A' },
    ];

    const brandsSeeded = await connection.manager.find(Brand);
    if (brandsSeeded.length === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Brand)
        .values(brands)
        .execute();
    }
  }
}
