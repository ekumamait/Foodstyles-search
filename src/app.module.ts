import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from './search/search.module';

@Module({
  imports: [TypeOrmModule.forRoot(), SearchModule],
})
export class AppModule {}
