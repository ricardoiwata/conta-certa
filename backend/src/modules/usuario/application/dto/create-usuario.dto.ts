import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  firebaseUid: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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