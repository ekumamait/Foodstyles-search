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

  /**
   * Constructs the SQL query for searching entities by type.
   * @returns The constructed SQL query string.
   */
  private constructSearchQuery(): string {
    return `
      SELECT 'city' AS type, id, name FROM city WHERE LOWER(name) LIKE ANY($1)
      UNION ALL
      SELECT 'brand' AS type, id, name FROM brand WHERE LOWER(name) LIKE ANY($1)
      UNION ALL
      SELECT 'dishType' AS type, id, name FROM dish_type WHERE LOWER(name) LIKE ANY($1)
      UNION ALL
      SELECT 'diet' AS type, id, name FROM diet WHERE LOWER(name) LIKE ANY($1)
    `;
  }

  /**
   * Finds entities of different types based on the search words.
   * @param searchWords - The array of search words.
   * @returns A promise that resolves to an array of found entities.
   */
  private async findEntitiesByType(searchWords: string[]): Promise<any[]> {
    const parameters = searchWords.map((word) => `%${word.toLowerCase()}%`);
    const query = this.constructSearchQuery();
    return this.cityRepository.query(query, [parameters]);
  }

  /**
   * Creates all possible combinations of the found entities.
   * @param entities - The array of found entities.
   * @returns An array of search result DTOs.
   */
  private createCombinations(entities: any[]): SearchResultDto[] {
    const results: SearchResultDto[] = [];
    const entityMap = this.mapEntitiesByType(entities);
    const entityTypes = Object.keys(entityMap).filter(
      (type) => entityMap[type].length > 0,
    );

    this.combineEntities({}, entityTypes, entityMap, results);

    return results;
  }

  /**
   * Maps entities by their type.
   * @param entities - The array of found entities.
   * @returns An object mapping entity types to their respective entities.
   */
  private mapEntitiesByType(entities: any[]): Record<string, any[]> {
    return {
      city: entities.filter((entity) => entity.type === 'city'),
      brand: entities.filter((entity) => entity.type === 'brand'),
      dishType: entities.filter((entity) => entity.type === 'dishType'),
      diet: entities.filter((entity) => entity.type === 'diet'),
    };
  }

  /**
   * Recursively creates combinations of entities and adds them to the results array.
   * @param currentEntities - The current combination of entities.
   * @param remainingTypes - The remaining types of entities to combine.
   * @param entityMap - The map of entity types to their respective entities.
   * @param results - The results array to add the combinations to.
   */
  private combineEntities(
    currentEntities: any,
    remainingTypes: string[],
    entityMap: Record<string, any[]>,
    results: SearchResultDto[],
  ): void {
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
      if (this.isSpecialCombination(nextType, currentEntities)) {
        this.addSpecialCombinations(
          newEntities,
          nextType,
          currentEntities,
          results,
        );
      } else {
        this.combineEntities(newEntities, restTypes, entityMap, results);
      }
    }
  }

  /**
   * Checks if the current combination needs special handling.
   * @param nextType - The next type of entity.
   * @param currentEntities - The current combination of entities.
   * @returns True if special handling is required, false otherwise.
   */
  private isSpecialCombination(
    nextType: string,
    currentEntities: any,
  ): boolean {
    return (
      (nextType === 'brand' && currentEntities['dishType']) ||
      (nextType === 'dishType' && currentEntities['brand'])
    );
  }

  /**
   * Adds special combinations to the results array.
   * @param newEntities - The new combination of entities.
   * @param nextType - The next type of entity.
   * @param currentEntities - The current combination of entities.
   * @param results - The results array to add the combinations to.
   */
  private addSpecialCombinations(
    newEntities: any,
    nextType: string,
    currentEntities: any,
    results: SearchResultDto[],
  ): void {
    const specialCaseObject = { ...newEntities };
    if (nextType === 'brand') {
      delete specialCaseObject.dishType;
    } else if (nextType === 'dishType') {
      delete specialCaseObject.brand;
    }
    results.push(specialCaseObject);
    results.push({ ...currentEntities });
  }

  /**
   * Extracts entities based on the search query.
   * @param query - The search query DTO.
   * @returns A promise that resolves to an array of search result DTOs.
   */
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

    return this.createCombinations(allEntities);
  }
}
