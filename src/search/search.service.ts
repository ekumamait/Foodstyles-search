import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../db/entities/city.entity';
import { Brand } from '../db/entities/brand.entity';
import { DishType } from '../db/entities/dishType.entity';
import { Diet } from '../db/entities/diet.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(DishType)
    private readonly dishTypeRepository: Repository<DishType>,
    @InjectRepository(Diet)
    private readonly dietRepository: Repository<Diet>,
  ) {}

  async extractEntities(searchTerm: string): Promise<any[]> {
    const results = [];

    if (!searchTerm) {
      return results;
    }

    const cities = await this.cityRepository.find();
    const brands = await this.brandRepository.find();
    const dishTypes = await this.dishTypeRepository.find();
    const diets = await this.dietRepository.find();

    const searchWords = searchTerm.toLowerCase().split(' ');

    for (const word of searchWords) {
      const city = cities.find((c) => c.name.toLowerCase() === word);
      const brand = brands.find((b) => b.name.toLowerCase() === word);
      const dishType = dishTypes.find((d) => d.name.toLowerCase() === word);
      const diet = diets.find((d) => d.name.toLowerCase() === word);

      const combination = {};
      if (city) combination['city'] = city;
      if (brand) combination['brand'] = brand;
      if (dishType) combination['dishType'] = dishType;
      if (diet) combination['diet'] = diet;

      if (Object.keys(combination).length > 0) {
        results.push(combination);
      }
    }

    return results;
  }
}
