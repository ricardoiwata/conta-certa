import { Categoria } from 'src/modules/categoria/domain/entities/categoria.entity';
import { Usuario } from 'src/modules/usuario/domain/entities/usuario.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Receita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column()
  data: Date;

  @Column()
  dataCompetencia: Date;

  @Column()
  descricao: string;

  @Column()
  origem: 'Fixo' | 'Variável';

  @Column()
  recorrentePai: boolean;

  @Column()
  recorrentePaiId: number;

  @Column()
  realizada: boolean;

  //Relations
  @ManyToOne(() => Usuario, (usuario) => usuario.receitas)
  usuario: Usuario;

  @Column()
  usuarioId: number;
}
