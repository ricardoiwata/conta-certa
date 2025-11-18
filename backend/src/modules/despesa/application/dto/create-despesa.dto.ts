import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDespesaDto {
  @IsString()
  @MaxLength(128)
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @IsDateString()
  @Transform(({ value }) => {
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

  @IsOptional()
  @IsNumber()
  recorrentePaiId?: number;

  @IsBoolean()
  realizada: boolean;

  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  categoriaId: number;
}
