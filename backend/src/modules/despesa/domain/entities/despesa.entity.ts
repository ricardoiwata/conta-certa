import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from '../../../usuario/domain/entities/usuario.entity';
import { Categoria } from 'src/modules/categoria/domain/entities/categoria.entity';

@Entity('despesas')
export class Despesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column()
  data: Date;

  @Column()
  formaPagamento:
    | 'Débito'
    | 'Cheque'
    | 'Crédito'
    | 'Pix'
    | 'Dinheiro'
    | 'Boleto';

  @Column({ default: false })
  recorrentePai: boolean;

  @Column({ nullable: true })
  recorrentePaiId?: number;

  @Column({ default: true })
  realizada: boolean;

  // Relations
  @ManyToOne(() => Usuario, (usuario) => usuario.despesas)
  usuario: Usuario;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.despesa)
  categoria: Categoria;

  @Column()
  categoriaId: number;
}
