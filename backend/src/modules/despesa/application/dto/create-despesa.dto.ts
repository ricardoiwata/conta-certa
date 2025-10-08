import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateDespesaDto {
  @IsString()
  @MaxLength(128)
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @IsDateString()
  @Transform(({ value }) => {
    // Se vier no formato dd/mm/yyyy, converte para yyyy-mm-dd
    if (typeof value === 'string' && value.includes('/')) {
      const [day, month, year] = value.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return value;
  })
  data: string;

  @IsString()
  formaPagamento:
    | 'Débito'
    | 'Cheque'
    | 'Crédito'
    | 'Pix'
    | 'Dinheiro'
    | 'Boleto';

  @IsBoolean()
  recorrentePai: boolean;

  @IsNumber()
  recorrentePaiId: number;

  @IsBoolean()
  realizada: boolean;

  @IsString()
  @IsNotEmpty()
  usuarioUid: string;

  @IsNumber()
  @IsNotEmpty()
  categoriaId: number;
}
