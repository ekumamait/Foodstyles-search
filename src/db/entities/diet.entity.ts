import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Diet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
