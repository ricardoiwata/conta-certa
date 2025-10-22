import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  // ADICIONE ESTA COLUNA
  @Column({ unique: true }) 
  email!: string;
}