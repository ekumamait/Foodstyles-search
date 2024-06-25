import { City } from '../../db/entities/city.entity';
import { Brand } from '../../db/entities/brand.entity';
import { DishType } from '../../db/entities/dishType.entity';
import { Diet } from '../../db/entities/diet.entity';

export class SearchResultDto {
  city?: City;
  brand?: Brand;
  dishType?: DishType;
  diet?: Diet;
}
