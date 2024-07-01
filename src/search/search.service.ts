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

  private generateCombinations(searchTerms, entityList): SearchResultDto[] {
    const matches = [];

    searchTerms.forEach(() => {
      matches.push({});
    });

    searchTerms.forEach((term, index) => {
      term = term.toLowerCase();
      entityList.forEach((entity) => {
        if (entity.name.toLowerCase().includes(term)) {
          if (!matches[index][entity.type]) {
            matches[index][entity.type] = entity;
          }
        }
      });
    });

    return this.getAllCombinations(matches);
  }

  private getAllCombinations(
    arr,
    index = 0,
    result = [],
    current = {},
  ): SearchResultDto[] {
    if (index === arr.length) {
      result.push(current);
    } else {
      const keys = Object.keys(arr[index]);
      keys.forEach((key) => {
        const element = arr[index][key];
        const newCurrent = { ...current };
        newCurrent[key] = element;
        this.getAllCombinations(arr, index + 1, result, newCurrent);
      });
    }
    return result;
  }

  private buildSearchResultDto(entities): SearchResultDto {
    const result: SearchResultDto = {};
    if (typeof entities === 'object' && entities !== null) {
      const types = Object.keys(entities);
      types.forEach((type) => {
        const entity = entities[type];
        const { id, name } = entity;
        result[type] = { id, name };
      });
    }
    return result;
  }

  async extractEntities(query: SearchQueryDto): Promise<SearchResultDto[]> {
    const { searchTerm } = query;
    const searchWords = searchTerm
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length >= 3);
    const allEntities = await this.findEntitiesByType(searchWords);

    if (allEntities.length === 0) {
      return [];
    }

    const combinations = this.generateCombinations(searchWords, allEntities);

    const results: SearchResultDto[] = combinations.map((combination) =>
      this.buildSearchResultDto(combination),
    );
    return results;
  }
}
