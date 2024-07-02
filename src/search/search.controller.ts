import { Controller, Get, Query } from '@nestjs/common';
import { SearchResultDto } from './dto/search-result.dto';
import { SearchQueryDto } from './dto/search-term.dto';
import { SearchService } from './search.service';
import { PaginationQuery } from 'src/common/decorators/pagination-query.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PaginatedDataResponseDto } from '../common/dto/pagination-data-response.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @PaginationQuery() options: IPaginationOptions,
    @Query() query: SearchQueryDto,
  ): Promise<PaginatedDataResponseDto<SearchResultDto[]>> {
    return this.searchService.extractEntities(query, options);
  }
}
