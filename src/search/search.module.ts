import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../db/entities/city.entity';
import { Brand } from '../db/entities/brand.entity';
import { DishType } from '../db/entities/dishType.entity';
import { Diet } from '../db/entities/diet.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City, Brand, DishType, Diet])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
