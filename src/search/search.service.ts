import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../db/entities/brand.entity';
import { City } from '../db/entities/city.entity';
import { Diet } from '../db/entities/diet.entity';
import { DishType } from '../db/entities/dishType.entity';
import { SearchResultDto } from './dto/search-result.dto';
import { SearchQueryDto } from './dto/search-term.dto';

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

  private async findEntitiesByType<T>(
    repository: Repository<T>,
    searchWords: string[],
  ): Promise<T[]> {
    if (!searchWords.length) return [];

    const query = repository.createQueryBuilder('entity');

    searchWords.forEach((word: string, index: number) => {
      query.orWhere(`LOWER(entity.name) LIKE LOWER(:word${index})`, {
        [`word${index}`]: `%${word}%`,
      });
    });

    return query.getMany();
  }

  private createCombinations(entities: any[]): SearchResultDto[] {
    const results: SearchResultDto[] = [];

    const entityMap = {
      city: entities.filter((entity) => entity instanceof City),
      brand: entities.filter((entity) => entity instanceof Brand),
      dishType: entities.filter((entity) => entity instanceof DishType),
      diet: entities.filter((entity) => entity instanceof Diet),
    };

    const createCombinations = (
      currentEntities: any,
      remainingTypes: string[],
    ): SearchResultDto[] => {
      if (remainingTypes.length === 0) {
        const resultDto: SearchResultDto = {};
        Object.keys(currentEntities).forEach((key) => {
          if (key !== 'type') {
            resultDto[key] = currentEntities[key];
          }
        });
        return [resultDto];
      }

      const [nextType, ...restTypes] = remainingTypes;
      const combinations: SearchResultDto[] = [];

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

  async extractEntities(query: SearchQueryDto): Promise<SearchResultDto[]> {
    const { searchTerm } = query;

    const searchWords = searchTerm
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length >= 3);

    if (searchWords.length === 0) {
      return [];
    }

    const [cities, brands, dishTypes, diets] = await Promise.all([
      this.findEntitiesByType(this.cityRepository, searchWords),
      this.findEntitiesByType(this.brandRepository, searchWords),
      this.findEntitiesByType(this.dishTypeRepository, searchWords),
      this.findEntitiesByType(this.dietRepository, searchWords),
    ]);

    const allEntities = [...cities, ...brands, ...dishTypes, ...diets];

    if (allEntities.length === 0) {
      return [];
    }

    return this.createCombinations(allEntities);
  }
}
