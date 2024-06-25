import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { DishType } from '../entities/dishType.entity';

export default class CreateDishTypes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const dishTypes: Partial<DishType>[] = [
      { id: 1, name: 'Sushi' },
      { id: 2, name: 'Pizza' },
      { id: 3, name: 'Burger' },
      { id: 4, name: 'Pasta' },
      { id: 5, name: 'Salad' },
      { id: 6, name: 'Sandwich' },
      { id: 7, name: 'Steak' },
      { id: 8, name: 'Seafood' },
      { id: 9, name: 'Tacos' },
      { id: 10, name: 'Chicken Wings' },
      { id: 11, name: 'Soup' },
      { id: 12, name: 'Burrito' },
      { id: 13, name: 'Fried Rice' },
      { id: 14, name: 'Noodle Soup' },
      { id: 15, name: 'BBQ' },
      { id: 16, name: 'Dim Sum' },
      { id: 17, name: 'Fish and Chips' },
      { id: 18, name: 'Tapas' },
      { id: 19, name: 'Pancakes' },
      { id: 20, name: 'Ramen' },
    ];

    const dishTypesSeeded = await connection.manager.find(DishType);
    if (dishTypesSeeded.length === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(DishType)
        .values(dishTypes)
        .execute();
    }
  }
}
