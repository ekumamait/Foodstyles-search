import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../db/entities/city.entity';
import { Brand } from '../db/entities/brand.entity';
import { DishType } from '../db/entities/dishType.entity';
import { Diet } from '../db/entities/diet.entity';
import { SearchResultDto } from './dto/search-result.dto';

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

  private async findEntityByName(
    repository: Repository<any>,
    name: string,
  ): Promise<any> {
    return repository
      .createQueryBuilder('entity')
      .where('LOWER(entity.name) = LOWER(:name)', { name })
      .getOne();
  }

  async getEntities(
    searchTermDto: string,
  ): Promise<{ message: string; results: SearchResultDto[] }> {
    const results = [];

    if (!searchTermDto) {
      throw new BadRequestException('Search word is required.');
    }

    const searchWords = searchTermDto.toLowerCase()?.split(' ');

    for (const word of searchWords) {
      const city = await this.findEntityByName(this.cityRepository, word);
      const brand = await this.findEntityByName(this.brandRepository, word);
      const dishType = await this.findEntityByName(
        this.dishTypeRepository,
        word,
      );
      const diet = await this.findEntityByName(this.dietRepository, word);

      const combination: SearchResultDto = {};
      if (city) combination.city = city;
      if (brand) combination.brand = brand;
      if (dishType) combination.dishType = dishType;
      if (diet) combination.diet = diet;

      if (Object.keys(combination).length > 0) {
        results.push(combination);
      }
    }

    if (results.length === 0) {
      return {
        message: 'Oops! We did not find what you are searching for.',
        results: [],
      };
    }

    return { message: 'Search successful', results };
  }
}
