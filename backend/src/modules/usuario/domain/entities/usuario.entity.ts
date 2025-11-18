import { Despesa } from 'src/modules/despesa/domain/entities/despesa.entity';
import { Notificacao } from 'src/modules/notificacao/domain/entities/notificacao.entity';
import { Receita } from 'src/modules/receita/domain/entities/receita.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  // ADICIONE ESTA COLUNA
  @Column({ unique: true })
  email!: string;

  @OneToMany(() => Notificacao, (notificacao) => notificacao.usuario)
  notificacoes: Notificacao[];

  @OneToMany(() => Despesa, (despesa) => despesa.usuario)
  despesas: Despesa[];

  @OneToMany(() => Receita, (receita) => receita.usuario)
  receitas: Receita[];
}
