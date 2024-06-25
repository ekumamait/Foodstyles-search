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

  private async findEntitiesByType(
    repository: Repository<any>,
    searchWords: string[],
    entityType: string,
  ): Promise<any[]> {
    const filteredWords = searchWords.filter((word) => word.length >= 3);

    if (filteredWords.length === 0) {
      return [];
    }

    const query = repository.createQueryBuilder('entity');
    filteredWords.forEach((word, index) => {
      query.orWhere(`LOWER(entity.name) LIKE LOWER(:word${index})`, {
        [`word${index}`]: `%${word}%`,
      });
    });
    const entities = await query.getMany();
    return entities.map((entity) => ({
      type: entityType,
      ...entity,
    }));
  }

  async extractEntities(
    searchTermDto: string,
  ): Promise<{ message: string; results: SearchResultDto[] }> {
    if (!searchTermDto) {
      throw new BadRequestException('Search word is required.');
    }

    const searchWords = searchTermDto
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length >= 3);

    if (searchWords.length === 0) {
      return {
        message:
          'Search term must contain at least one word with three or more characters.',
        results: [],
      };
    }

    const cities = await this.findEntitiesByType(
      this.cityRepository,
      searchWords,
      'city',
    );
    const brands = await this.findEntitiesByType(
      this.brandRepository,
      searchWords,
      'brand',
    );
    const dishTypes = await this.findEntitiesByType(
      this.dishTypeRepository,
      searchWords,
      'dishType',
    );
    const diets = await this.findEntitiesByType(
      this.dietRepository,
      searchWords,
      'diet',
    );

    const allEntities = [...cities, ...brands, ...dishTypes, ...diets];

    if (allEntities.length === 0) {
      return {
        message: 'Oops! We did not find what you are searching for.',
        results: [],
      };
    }

    const combinations = this.createCombinations(allEntities);

    return { message: 'Search successful', results: combinations };
  }

  private createCombinations(entities: any[]): SearchResultDto[] {
    const results: SearchResultDto[] = [];

    const entityMap = {
      city: entities.filter((entity) => entity.type === 'city'),
      brand: entities.filter((entity) => entity.type === 'brand'),
      dishType: entities.filter((entity) => entity.type === 'dishType'),
      diet: entities.filter((entity) => entity.type === 'diet'),
    };

    const createCombinations = (
      currentEntities,
      remainingTypes,
    ): SearchResultDto[] => {
      if (remainingTypes.length === 0) {
        return [currentEntities];
      }

      const [nextType, ...restTypes] = remainingTypes;
      const combinations = [];

      for (const entity of entityMap[nextType]) {
        const newEntities = { ...currentEntities, [nextType]: entity };
        combinations.push(...createCombinations(newEntities, restTypes));
      }

      return combinations;
    };

    const entityTypes = Object.keys(entityMap).filter(
      (type) => entityMap[type].length > 0,
    );

    results.push(...createCombinations({}, entityTypes));

    return results;
  }
}
