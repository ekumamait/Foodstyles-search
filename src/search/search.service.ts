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

    searchTerms.forEach((term) => {
      const termMatches = entityList.filter((entity) =>
        entity.name.toLowerCase().includes(term.toLowerCase()),
      );
      matches.push(termMatches);
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
      result.push({ ...current });
      return result;
    }

    for (const element of arr[index]) {
      if (!current[element.type]) {
        const newCurrent = {
          ...current,
          [element.type]: { id: element.id, name: element.name },
        };
        this.getAllCombinations(arr, index + 1, result, newCurrent);
      }
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
    return combinations;
  }
}
