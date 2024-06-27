import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Diet } from '../entities/diet.entity';

export default class CreateDiets implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const diets: Partial<Diet>[] = [
      { id: 1, name: 'Vegan' },
      { id: 2, name: 'Vegetarian' },
      { id: 3, name: 'Pescatarian' },
      { id: 4, name: 'Paleo' },
      { id: 5, name: 'Fruitarian' },
      { id: 6, name: 'Ketogenic' },
      { id: 7, name: 'Gluten-Free' },
      { id: 8, name: 'Diary-Free' },
      { id: 9, name: 'Egg-Free' },
      { id: 10, name: 'Soy-Free' },
      { id: 11, name: 'Grain-Free' },
      { id: 12, name: 'Sugar-Free' },
      { id: 13, name: 'Wheat-Free' },
      { id: 14, name: 'Nut-Free' },
      { id: 15, name: 'Carnivore' },
      { id: 16, name: 'Alkaline' },
      { id: 17, name: 'Pollotarian' },
      { id: 18, name: 'Shellfish-Free' },
    ];

    await connection.getRepository(Diet).clear();

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
