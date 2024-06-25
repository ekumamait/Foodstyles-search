import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialTables1719317033056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO cities (name) VALUES ('London'), ('New York'), ('Paris')`,
    );

    await queryRunner.query(
      `INSERT INTO brands (name) VALUES ('McDonald''s'), ('Starbucks'), ('Burger King')`,
    );

    await queryRunner.query(
      `INSERT INTO dish_types (name) VALUES ('Sushi'), ('Pizza'), ('Burger')`,
    );

    await queryRunner.query(
      `INSERT INTO diets (name) VALUES ('Vegan'), ('Vegetarian'), ('Gluten-Free')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM cities WHERE name IN ('London', 'New York', 'Paris')`,
    );

    await queryRunner.query(
      `DELETE FROM brands WHERE name IN ('McDonald''s', 'Starbucks', 'Burger King')`,
    );

    await queryRunner.query(
      `DELETE FROM dish_types WHERE name IN ('Sushi', 'Pizza', 'Burger')`,
    );

    await queryRunner.query(
      `DELETE FROM diets WHERE name IN ('Vegan', 'Vegetarian', 'Gluten-Free')`,
    );
  }
}
