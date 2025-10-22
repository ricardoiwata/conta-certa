import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString({ message: 'O nome da categoria deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da categoria não pode estar vazio.' })
  @MaxLength(100, { message: 'O nome da categoria não pode ter mais de 100 caracteres.' })
  nomeCategoria: string;
}