import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateReceitaDto {
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

  @IsDateString()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.includes('/')) {
      const [day, month, year] = value.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return value;
  })
  dataCompetencia: string;

  @IsString()
  origem: 'Fixo' | 'Variável';

  @IsBoolean()
  recorrentePai: boolean;

  @IsNumber()
  recorrentePaiId: number;

  @IsBoolean()
  realizada: boolean;

  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;
}
