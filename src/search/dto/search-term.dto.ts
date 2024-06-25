import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SearchQueryDto {
  @Length(3)
  @IsString()
  @IsNotEmpty()
  searchTerm: string;
}
