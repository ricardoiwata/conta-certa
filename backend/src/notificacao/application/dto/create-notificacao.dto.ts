import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificacaoDto {
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;
}
