import { Despesa } from 'src/modules/despesa/domain/entities/despesa.entity';
import { Receita } from 'src/modules/receita/domain/entities/receita.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeCategoria: string;

  @OneToMany(() => Despesa, (despesa) => despesa.categoria)
  despesa: Despesa[];
}
