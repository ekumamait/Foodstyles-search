import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Brand } from '../entities/brand.entity';

export default class CreateBrands implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const brands: Partial<Brand>[] = [
      { id: 1, name: 'Costa Coffee' },
      { id: 2, name: 'Greggs' },
      { id: 3, name: 'Subway' },
      { id: 4, name: "McDonald's" },
      { id: 5, name: 'KFC' },
      { id: 6, name: 'Greene King' },
      { id: 7, name: 'Wetherspoon' },
      { id: 8, name: 'Caffé Nero' },
      { id: 9, name: 'Burger King' },
      { id: 10, name: 'Pizza Hut' },
      { id: 11, name: 'Pret A Manger' },
      { id: 12, name: 'PizzaExpress' },
      { id: 13, name: 'Hungry Horse' },
      { id: 14, name: 'Lounges' },
      { id: 15, name: 'Sushimania' },
      { id: 16, name: 'Five Guys' },
      { id: 17, name: 'Chef & Brewer Collection' },
      { id: 18, name: "Gail's" },
      { id: 19, name: 'Zizzi' },
      { id: 20, name: 'Taco Bell' },
      { id: 21, name: 'Creams' },
      { id: 22, name: 'Coffee#1' },
      { id: 23, name: 'Prezzo' },
      { id: 24, name: "Morley's" },
      { id: 25, name: 'Favorite' },
      { id: 26, name: 'Chaiiwala' },
      { id: 27, name: 'Cote' },
      { id: 28, name: 'Panku' },
      { id: 29, name: 'Itsu' },
      { id: 30, name: "Kaspa's Desserts" },
      { id: 31, name: 'Fridays' },
      { id: 32, name: 'Poundbakery' },
      { id: 33, name: 'Kokoro' },
      { id: 34, name: 'Bella Italia' },
      { id: 35, name: 'Chopstix' },
      { id: 36, name: 'JOE & THE JUICE' },
      { id: 37, name: 'Tortilla' },
      { id: 38, name: 'Franco Manca' },
      { id: 39, name: 'Tops Pizza' },
      { id: 40, name: 'Ask Italian' },
      { id: 41, name: 'Farmhouse Inns' },
      { id: 42, name: 'Wimpy' },
      { id: 43, name: 'Muffin Break' },
      { id: 44, name: 'Black Sheep Coffee' },
      { id: 45, name: 'Turtle Bay' },
      { id: 46, name: 'Giggling Squid' },
      { id: 47, name: 'Heavenly Desserts' },
      { id: 48, name: "Sam's Chicken" },
      { id: 49, name: 'Tim Hortons' },
      { id: 50, name: 'Wildwood' },
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
