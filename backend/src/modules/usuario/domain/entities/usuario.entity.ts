import { Notificacao } from 'src/notificacao/domain/entities/notificacao.entity';
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
}
