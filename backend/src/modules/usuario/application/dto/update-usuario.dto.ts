import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(11)
  cpf?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  estado?: string;

  @IsString()
  @IsOptional()
  @MaxLength(8)
  cep?: string;
}
