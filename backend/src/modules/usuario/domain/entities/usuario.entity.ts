import { Notificacao } from 'src/modules/notificacao/domain/entities/notificacao.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: true })
  firebaseUid?: string;

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  cpf?: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ nullable: true })
  endereco?: string;

  @Column({ nullable: true })
  cidade?: string;

  @Column({ nullable: true })
  estado?: string;

  @Column({ nullable: true })
  cep?: string;

  @CreateDateColumn()
  criadoEm!: Date;

  @UpdateDateColumn()
  atualizadoEm!: Date;

  @OneToMany(() => Notificacao, (notificacao) => notificacao.usuario)
  notificacoes: Notificacao[];
}
