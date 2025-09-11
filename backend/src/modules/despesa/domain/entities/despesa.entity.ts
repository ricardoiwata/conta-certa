import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../../../usuario/domain/entities/usuario.entity';

@Entity('despesas')
export class Despesa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  descricao!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor!: number;

  @Column()
  data!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { nullable: true })
  usuarioId?: number;
}
