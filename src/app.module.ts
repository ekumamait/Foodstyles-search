import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { City } from './db/entities/city.entity';
import { Brand } from './db/entities/brand.entity';
import { DishType } from './db/entities/dishType.entity';
import { Diet } from './db/entities/diet.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your_username',
      password: 'your_password',
      database: 'foodstyles',
      entities: [City, Brand, DishType, Diet],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([City, Brand, DishType, Diet]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
