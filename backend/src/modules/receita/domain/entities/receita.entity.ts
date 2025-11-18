import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Receita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column('datetime', { nullable: true })
  data: Date;

  @Column('datetime', { nullable: true })
  dataCompetencia: Date;

  @Column()
  descricao: string;

  @Column()
  origem: 'Fixo' | 'Variável';

  @Column()
  recorrentePai: boolean;

  @Column({ nullable: true })
  recorrentePaiId: number;

  @Column()
  realizada: boolean;

  // Firebase user UID (no local relation)
  @Column()
  usuarioUid: string;
}
