import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PreferenciasNotificacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  notificarEmail: boolean;

  @Column({ default: false })
  notificarSms: boolean;

  @Column({ default: false })
  notificarPush: boolean;

  @Column({ default: false })
  notificarSaldoBaixo: boolean;

  @Column({ default: false })
  notificarTransacoesSuspeitas: boolean;

  @Column()
  usuarioId: number;

  @OneToOne(() => Usuario)
  usuario: Usuario;
}
