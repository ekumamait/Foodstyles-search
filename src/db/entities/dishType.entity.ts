import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DishType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
