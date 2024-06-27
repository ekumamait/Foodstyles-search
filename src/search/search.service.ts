import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../db/entities/city.entity';
import { SearchResultDto } from './dto/search-result.dto';
import { SearchQueryDto } from './dto/search-term.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  private async findEntitiesByType(searchWords: string[]): Promise<any[]> {
    const parameters = searchWords.map((word) => `%${word.toLowerCase()}%`);

    const query = `
      SELECT 'city' AS type, id, name FROM city WHERE LOWER(name) LIKE ANY($1)
      UNION ALL
      SELECT 'brand' AS type, id, name FROM brand WHERE LOWER(name) LIKE ANY($1)
      UNION ALL
      SELECT 'dishType' AS type, id, name FROM dish_type WHERE LOWER(name) LIKE ANY($1)
      UNION ALL
      SELECT 'diet' AS type, id, name FROM diet WHERE LOWER(name) LIKE ANY($1)
    `;

    const results = await this.cityRepository.query(query, [parameters]);

    return results;
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
      currentEntities: any,
      remainingTypes: string[],
    ): void => {
      if (remainingTypes.length === 0) {
        results.push({ ...currentEntities });
        return;
      }

      const [nextType, ...restTypes] = remainingTypes;

      for (const entity of entityMap[nextType]) {
        const newEntities = {
          ...currentEntities,
          [nextType]: {
            id: entity.id,
            name: entity.name,
          },
        };
        if (nextType === 'brand' && currentEntities['dishType']) {
          const brandObject = { ...newEntities };
          delete brandObject.dishType;
          results.push(brandObject);

          const dishTypeObject = { ...currentEntities };
          delete dishTypeObject.brand;
          results.push(dishTypeObject);
        } else if (nextType === 'dishType' && currentEntities['brand']) {
          const dishTypeObject = { ...newEntities };
          delete dishTypeObject.brand;
          results.push(dishTypeObject);

          const brandObject = { ...currentEntities };
          delete brandObject.dishType;
          results.push(brandObject);
        } else {
          createCombinations(newEntities, restTypes);
        }
      }
    };

    const entityTypes = Object.keys(entityMap).filter(
      (type) => entityMap[type].length > 0,
    );

    createCombinations({}, entityTypes);

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

    const allEntities = await this.findEntitiesByType(searchWords);

    if (allEntities.length === 0) {
      return [];
    }

    return this.createCombinations(allEntities);
  }
}
