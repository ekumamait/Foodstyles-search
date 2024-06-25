import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Diet } from '../entities/diet.entity';

export default class CreateDiets implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const diets: Partial<Diet>[] = [
      { id: 1, name: 'Vegan' },
      { id: 2, name: 'Vegetarian' },
      { id: 3, name: 'Gluten-Free' },
      { id: 4, name: 'Paleo' },
      { id: 5, name: 'Keto' },
      { id: 6, name: 'Low-Carb' },
      { id: 7, name: 'Mediterranean' },
      { id: 8, name: 'Pescatarian' },
      { id: 9, name: 'Whole30' },
      { id: 10, name: 'Flexitarian' },
      { id: 11, name: 'Raw Food' },
      { id: 12, name: 'Nut-Free' },
      { id: 13, name: 'Dairy-Free' },
      { id: 14, name: 'Low-Sodium' },
      { id: 15, name: 'Halal' },
      { id: 16, name: 'Kosher' },
      { id: 17, name: 'Organic' },
      { id: 18, name: 'Fair Trade' },
      { id: 19, name: 'Non-GMO' },
      { id: 20, name: 'Locavore' },
    ];

    const dietsSeeded = await connection.manager.find(Diet);
    if (dietsSeeded.length === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Diet)
        .values(diets)
        .execute();
    }
  }
}
