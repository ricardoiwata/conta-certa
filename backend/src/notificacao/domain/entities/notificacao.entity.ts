import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notificacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @Column({ default: true })
  ativa: boolean;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.notificacoes)
  usuario: Usuario;
}
